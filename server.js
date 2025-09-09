const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // ✅ add this

// Load env variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    // One-time cleanup: drop legacy unique index on 'id' from old Product schema
    try {
      const Product = require("./models/Product");
      const indexes = await Product.collection.indexes();
      const hasLegacyIdIndex = indexes.some((idx) => idx.name === "id_1");
      if (hasLegacyIdIndex) {
        await Product.collection.dropIndex("id_1");
        console.log("🧹 Dropped legacy index id_1 from products collection");
      }
    } catch (e) {
      if (e && e.codeName !== "IndexNotFound") {
        console.warn("Index cleanup warning:", e.message);
      }
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// JSON parsing error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON in request body:", err.message);
    return res.status(400).json({ message: "Invalid JSON payload sent." });
  }
  next();
});

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes); // ✅ image uploads

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Test route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found",
    method: req.method,
    path: req.originalUrl,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
