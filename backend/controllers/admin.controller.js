const Admin = require("../models/Admin.model");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await
     Admin.findOne({ email });

    if (!admin) return
     res.status(404).json({ message: "Admin not found" });

    const isMatch = await
     bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials"
      });

    const token = generateToken(admin._id);

    res.status(200).json({ message:
         "Login successful", 
         token, admin });
  } catch (err) {
    res.status(500).json({ message:
         "Server error", error: err.message });
  }
};


exports.getAllUsers = 
async (req, res) => {


  try {
    const users = await 
    User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {


    res.status(500).json({ message: 
        "Error fetching users", 
        error: err.message });
  }
};



  try {
    const products = await 
    Product.find().populate
    ("seller", "name email");
    res.status(200).json(products);

  } catch (err) {


    res.status(500).json({ message:
         "Error fetching products", 
         error: err.message });
  }
exports.verifyArtisan = async (req, res) => {
  const { artisanId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      artisanId,
      { isVerified: true },
      { new: true }
    );

    res.status(200).json({ message: 
        "Artisan verified", user });

  } catch (err) {

    res.status(500).json({ message: 
        "Verification failed",
         error: err.message });
  }
};


exports.deleteUser = 
async (req, res) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 
        "User deleted" });
  } catch (err) {
    res.status(500).json({ message: 
        "Delete failed", error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 
        "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: 
        "Delete failed", error: err.message });
  }
};