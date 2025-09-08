const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check all fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user (role will default to "user")
    const user = await User.create({
      name,
      email,
      password,
      mobile,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role, // always "user" by default
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ...existing code...
 
// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      username: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add address (max 3)
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.addresses && user.addresses.length >= 3) {
      return res.status(400).json({ message: "Maximum of 3 addresses allowed" });
    }
    const addr = req.body || {};
    user.addresses.push(addr);
    await user.save();
    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update address by subdoc id
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    Object.assign(addr, req.body || {});
    await user.save();
    res.json(addr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address by subdoc id
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });
    addr.deleteOne();
    await user.save();
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, addAddress, updateAddress, deleteAddress };
