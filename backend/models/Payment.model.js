import mongoose, { now } from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        unique: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        unique: true,
    },
    razorpaySignature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: 'INR',
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Card', 'Net Banking', 'UPI', 'Wallet'],
    },
    paymentstatus: {
        type: String,
        required: true,
        enum: ['Created', 'Paid', 'Failed'],
        default: 'Created',
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
