const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["kg", "nos"],
      default: "kg",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    bulkQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    bulkPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;


