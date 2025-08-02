import Product from '../models/Product.model.js';

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock, discount } =
            req.body;
        const artisanId = req.user._id;

        if (!artisanId) {
            return res.status(400).json({
                message: 'Artisan ID is required',
            });
        }

        if (!name || !description || !price || !category || !image) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                message: 'Price must be a positive number',
            });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({
                message: 'Stock must be a non-negative number',
            });
        }

        if (typeof discount !== 'number' || discount < 0) {
            return res.status(400).json({
                message: 'Discount must be a non-negative number',
            });
        }

        if (
            !image.startsWith('http') ||
            (!image.endsWith('.jpg') && !image.endsWith('.png'))
        ) {
            return res.status(400).json({
                message: 'Image URL should be valid',
            });
        }

        const product = await Product.create({
            artisanId,
            name,
            description,
            price,
            category,
            image,
            stock,
            discount,
        });

        await product.save();

        return res.status(200).json({
            message: 'Product created successfully',
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error creating product',
            error: err.message,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
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
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(productId, updates, {
            new: true,
        });
        if (!product) {
            return res.status(400).json({
                message: 'Product not found',
            });
        }

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

        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(400).json({
                message: 'Product not found',
            });
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
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
