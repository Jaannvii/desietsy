const Order = require("../models/orderModel");
const Product = require("../models/productModel");


exports.createOrder = async (req, res) => {
  const { items, shippingInfo, paymentMethod, totalAmount } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    const newOrder = new Order({
      user: userId,
      items,
      shippingInfo,
      paymentMethod,
      totalAmount,
      orderStatus: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};


exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};


exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all orders", error: err.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};


exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
};