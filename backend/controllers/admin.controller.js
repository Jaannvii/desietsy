import User from '../models/User.model.js';
import Artisan from '../models/Artisan.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';

const getAllArtisans = async (req, res) => {
    try {
        const artisans = await Artisan.find();
        res.status(200).json(artisans);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching artisans',
            error: err.message,
        });
    }
};

const verifyArtisan = async (req, res) => {
    try {
        const artisanId = req.params.id;
        const artisan = await User.findByIdAndUpdate(
            artisanId,
            { isVerified: true },
            { new: true }
        );
        if (!artisan) {
            return res.status(400).json({ message: 'Artisan not found' });
        }

        res.status(200).json({ message: 'Artisan verified', artisan });
    } catch (err) {
        res.status(500).json({
            message: 'Verification failed',
            error: err.message,
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching products',
            error: err.message,
        });
    }
};

const approveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            productId,
            { isApproved: true },
            { new: true }
        );
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product approved', product });
    } catch (err) {
        res.status(500).json({
            message: 'Approval failed',
            error: err.message,
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: err.message,
        });
    }
};

export {
    getAllArtisans,
    verifyArtisan,
    getAllProducts,
    approveProduct,
    getAllOrders,
};
