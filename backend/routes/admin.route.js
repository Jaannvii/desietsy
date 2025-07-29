import express from "express";
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.post("/login", adminController.loginAdmin);
router.get("/users", verifyAdmin, adminController.getAllUsers);
router.get("/products", verifyAdmin, adminController.getAllProducts);
router.put("/verify-artisan/:artisanId", verifyAdmin, adminController.verifyArtisan);
router.delete("/user/:userId", verifyAdmin, adminController.deleteUser);
router.delete("/product/:productId", verifyAdmin, adminController.deleteProduct);

module.exports = router;