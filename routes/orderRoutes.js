const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth");
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelMyOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.put("/mine/:orderId/cancel", protect, cancelMyOrder);

// Admin endpoints
router.get("/admin", protect, adminOnly, getAllOrders);
router.put("/admin/:orderId/status", protect, adminOnly, updateOrderStatus);

module.exports = router;


