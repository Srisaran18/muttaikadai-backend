const Order = require("../models/Order");

// Create order for logged-in user
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, deliveryAddress, billingAddress, contactPhone } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const normalizedItems = items.map((it) => ({
      productId: it.productId,
      name: it.name,
      type: it.type,
      unitPrice: Number(it.unitPrice),
      quantity: Number(it.quantity),
      image: it.image || "",
    }));

    const totalItems = normalizedItems.reduce((sum, it) => sum + it.quantity, 0);
    const totalPrice = normalizedItems.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

    const order = await Order.create({
      user: userId,
      items: normalizedItems,
      totalItems,
      totalPrice,
      deliveryAddress,
      billingAddress,
      contactPhone: contactPhone || "",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all orders
exports.getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: cancel own order (only if not shipped/delivered/cancelled)
exports.cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is ${order.status}` });
    }
    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


