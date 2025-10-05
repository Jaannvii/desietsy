import Order from '../models/Order.model.js';

const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingInfo, paymentMethod } = req.body;
        const userId = req.user.id;

        if (!products || products.length === 0) {
            return res
                .status(400)
                .json({ message: 'Order must contain at least one product' });
        }

        for (const product of products) {
            if (!product.productId || !product.quantity) {
                return res.status(400).json({
                    message: 'Product must have a valid ID and quantity',
                });
            }
        }

        if (!totalAmount || typeof totalAmount !== 'number') {
            return res
                .status(400)
                .json({ message: 'Total amount is required' });
        }

        if (
            typeof shippingInfo !== 'object' ||
            !shippingInfo.address ||
            !shippingInfo.city ||
            !shippingInfo.state ||
            !shippingInfo.postalCode ||
            !shippingInfo.country
        ) {
            return res
                .status(400)
                .json({ message: 'Complete shipping information is required' });
        }

        if (
            !paymentMethod ||
            !['Credit Card', 'PayPal', 'Cash on Delivery', 'Razorpay'].includes(
                paymentMethod
            )
        ) {
            return res
                .status(400)
                .json({ message: 'Valid payment method is required' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        const newOrder = await Order.create({
            userId,
            products,
            totalAmount,
            shippingInfo,
            paymentMethod,
        });
        if (!newOrder) {
            return res.status(400).json({ message: 'Order creation failed' });
        }

        await newOrder.save();

        return res
            .status(200)
            .json({ message: 'Order placed', order: newOrder });
    } catch (err) {
        return res.status(500).json({
            message: 'Order creation failed',
            error: err.message,
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('userId', 'username email')
            .populate(
                'products.productId',
                'name price discountedPrice category image'
            );
        return res.status(200).json({
            message: 'Orders fetched successfully',
            orders,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to fetch orders',
            error: err.message,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({
            message: 'Error fetching order',
            error: err.message,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { paymentStatus, orderStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.user.role !== 'Admin') {
            return res
                .status(403)
                .json({ message: 'Not authorized to update order status' });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        order.updatedAt = Date.now();

        const updatedOrder = await order.save();

        return res.status(200).json({
            message: 'Order status updated successfully',
            order: updatedOrder,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to update order status',
            error: err.message,
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to delete order',
            error: err.message,
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.orderStatus === 'Delivered')
            return res
                .status(400)
                .json({ message: 'Delivered order cannot be cancelled' });

        await Order.findByIdAndDelete(order._id);

        return res.json({ message: 'Order cancelled successfully', order });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Server error', error: err.message });
    }
};

export {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
};
