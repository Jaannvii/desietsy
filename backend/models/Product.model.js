import mongoose from 'mongoose';

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
        ref: 'Artisan',
        required: true,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    stock: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
