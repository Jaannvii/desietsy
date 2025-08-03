import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    shopName: {
        type: String,
        required: false,
        trim: true,
    },
    bio: {
        type: String,
        required: false,
        maxlength: 500,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: false,
        trim: true,
    },
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        postalCode: { type: String, required: false },
        country: { type: String, required: false },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const Artisan = mongoose.model('Artisan', artisanSchema);

export default Artisan;
