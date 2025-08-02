import mongoose from 'mongoose';
import Artisan from './Artisan.model.js';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    artisanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
