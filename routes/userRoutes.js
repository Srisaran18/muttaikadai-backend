const express = require("express");
const { registerUser, loginUser, getMe, addAddress, updateAddress, deleteAddress } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Register route
router.post("/register", registerUser);
router.post("/login", loginUser);
// Also accept capitalized path just in case any client uses it
router.post("/Login", loginUser);

// Profile and addresses (protected)
router.get("/me", protect, getMe);
router.post("/me/addresses", protect, addAddress);
router.put("/me/addresses/:addressId", protect, updateAddress);
router.delete("/me/addresses/:addressId", protect, deleteAddress);

module.exports = router;
