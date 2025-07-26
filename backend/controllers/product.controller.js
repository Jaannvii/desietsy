import Product from '../models/Product.model.js';

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock, discount } =
            req.body;
        const artisanId = req.user?._id || req.body.artisanId;

        if (!artisanId) {
            return res.status(401).json({
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
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating product',
            error: error.message,
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('artisanId', 'name');
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching products',
        });
    }
};

export { createProduct, getProducts };
