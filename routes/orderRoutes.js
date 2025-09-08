const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth");
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);

// Admin endpoints
router.get("/admin", protect, adminOnly, getAllOrders);
router.put("/admin/:orderId/status", protect, adminOnly, updateOrderStatus);

module.exports = router;


