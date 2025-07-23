import mongoose, { now } from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        razorpay_orderId: {
            type: String,
            required:true,
            unique: true,

        },
        razorpay_payment_Id: {
            type: String,
            required: true,
            unique: true,
        },
        razorpay_signature:{
            type: String,
            required: true,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,

        },
        currency:{
            type: String,
            required: true,
            default: 'INR',
        },
        paymentstatus:{
            type: String,
            required: true,
            enum: ['Created', 'paid', 'Failed'],
            default: 'Paid',
        },
        createAt:{
            type: Date,
            default: Date.now,
        },
        
    }
);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
