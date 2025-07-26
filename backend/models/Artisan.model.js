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
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
        maxlength: 500,
        minlength: 10,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const Artisan = mongoose.model('Artisan', artisanSchema);

export default Artisan;
