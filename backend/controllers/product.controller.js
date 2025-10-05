import Product from '../models/Product.model.js';
import Artisan from '../models/Artisan.model.js';
import Category from '../models/Category.model.js';

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            categoryName,
            categoryImage,
            image,
            stock,
            discount,
        } = req.body;

        const artisan = await Artisan.findOne({ userId: req.user._id });
        if (!artisan) {
            return res.status(400).json({
                message: 'Artisan not found',
            });
        }

        if (
            !artisan.shopName ||
            !artisan.bio ||
            !artisan.contactNumber ||
            !artisan.address
        ) {
            return res.status(400).json({
                message:
                    'Artisan profile is incomplete. Please update your profile before adding products.',
            });
        }

        if (!artisan.isVerified) {
            return res.status(403).json({
                message: 'Artisan is not verified. Cannot add products.',
            });
        }

        if (!name || !description || !price || !categoryName || !image) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                message: 'Price must be a positive number',
            });
        }

        if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
            return res.status(400).json({
                message: 'Stock must be a non-negative number',
            });
        }

        if (
            discount !== undefined &&
            (typeof discount !== 'number' || discount < 0)
        ) {
            return res.status(400).json({
                message: 'Discount must be a non-negative number',
            });
        }

        if (!image.startsWith('http')) {
            return res.status(400).json({
                message: 'Image URL should be valid',
            });
        }

        let category = await Category.findOne({
            categoryName: categoryName.trim(),
        });
        if (!category) {
            if (!categoryImage || !categoryImage.startsWith('http')) {
                return res.status(400).json({
                    message:
                        'New category must include a valid category image URL.',
                });
            }
            category = await Category.create({
                categoryName: categoryName.trim(),
                categoryImage,
            });
            await category.save();
        }

        const priceNum =
            price !== undefined && price !== '' ? Number(price) : 0;
        const discountNum =
            discount !== undefined && discount !== '' ? Number(discount) : 0;

        const discountedPrice =
            discountNum > 0
                ? Number((priceNum * (1 - discountNum / 100)).toFixed(2))
                : priceNum;

        const product = await Product.create({
            artisanId: artisan._id,
            name,
            description,
            price: priceNum,
            category: category._id,
            image,
            stock: stock || 0,
            discount: discountNum || 0,
            discountedPrice,
        });

        await product.save();

        return res.status(200).json({
            message: 'Product created successfully',
            product,
            category,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error creating product',
            error: err.message,
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categoriesWithProducts = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    let: { categoryId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$category', '$$categoryId'] },
                                isApproved: true,
                            },
                        },
                    ],
                    as: 'products',
                },
            },
            {
                $match: { 'products.0': { $exists: true } },
            },
            {
                $project: {
                    categoryName: 1,
                    categoryImage: 1,
                    productsCount: { $size: '$products' },
                },
            },
        ]);

        res.status(200).json(categoriesWithProducts);
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching categories',
            error: err.message,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const filter = { isApproved: true };

        if (req.user?._id && req.user.role === 'Artisan') {
            const artisan = await Artisan.findOne({ userId: req.user._id });
            if (!artisan) {
                return res.status(400).json({ message: 'Artisan not found' });
            }
            filter = { artisanId: artisan._id };
        }

        if (req.query.category) {
            const category = await Category.findOne({
                categoryName: req.query.category,
            });
            if (category) {
                filter.category = category._id;
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        const products = await Product.find(filter).populate('category');
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching products',
            error: err.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found',
            });
        }

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching product',
            error: err.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { categoryName, categoryImage, price, discount, ...rest } =
            req.body;

        const updates = { ...rest };

        if (categoryName) {
            let category = await Category.findOne({
                categoryName: categoryName.trim(),
            });

            if (!category) {
                if (!categoryImage || !categoryImage.startsWith('http')) {
                    return res.status(400).json({
                        message:
                            'New category must include a valid category image URL.',
                    });
                }
                category = await Category.create({
                    categoryName: categoryName.trim(),
                    categoryImage,
                });
                await category.save();
            } else if (categoryImage) {
                category.categoryImage = categoryImage;
                await category.save();
            }

            updates.category = category._id;
        }

        const existing = await Product.findById(productId);
        if (!existing) {
            return res.status(400).json({
                message: 'Product not found',
            });
        }

        if (price !== undefined || discount !== undefined) {
            const priceNum =
                price !== undefined && price !== ''
                    ? Number(price)
                    : existing.price;
            const discountNum =
                discount !== undefined && discount !== ''
                    ? Number(discount)
                    : existing.discount || 0;

            updates.price = priceNum;
            updates.discount = discountNum;
            updates.discountedPrice =
                discountNum > 0
                    ? Number((priceNum * (1 - discountNum / 100)).toFixed(2))
                    : priceNum;
        }

        const product = await Product.findByIdAndUpdate(productId, updates, {
            new: true,
        }).populate('category');

        return res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error updating product',
            error: err.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found',
            });
        }

        const categoryId = product.category;

        await Product.findByIdAndDelete(productId);

        const remainingProducts = await Product.find({ category: categoryId });

        if (remainingProducts.length === 0) {
            await Category.findByIdAndDelete(categoryId);
        }

        return res.status(200).json({
            message: 'Product deleted successfully',
            productId,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error deleting product',
            error: err.message,
        });
    }
};

export {
    createProduct,
    getCategories,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
