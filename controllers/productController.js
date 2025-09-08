const Product = require("../models/Product");

// Create product (Mongo _id is used)
exports.createProduct = async (req, res) => {
  try {
    const { name, type, price, bulkQuantity, bulkPrice, image, stock } = req.body;
    const product = await Product.create({
      name,
      type,
      price,
      bulkQuantity,
      bulkPrice,
      image,
      stock,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by Mongo _id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product by Mongo _id
exports.updateProduct = async (req, res) => {
  try {
    const update = { ...req.body };
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product by Mongo _id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


