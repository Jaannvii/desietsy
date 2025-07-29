import express from express;
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyUser, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyUser, orderController.createOrder);
router.get("/my", verifyUser, orderController.getUserOrders);
router.get("/:orderId", verifyUser, orderController.getOrderById);
router.get("/", verifyAdmin, orderController.getAllOrders);
router.put("/:orderId/status", verifyAdmin, orderController.updateOrderStatus);
router.delete("/:orderId", verifyAdmin, orderController.deleteOrder);

module.exports = router;