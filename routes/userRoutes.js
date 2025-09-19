const express = require("express");
const { registerUser, loginUser, getMe, addAddress, updateAddress, deleteAddress, adminListUsers, adminDeleteUser, adminToggleBlock, adminToggleAdmin } = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/auth");

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

// Admin user management
router.get("/admin/users", protect, adminOnly, adminListUsers);
router.delete("/admin/users/:userId", protect, adminOnly, adminDeleteUser);
router.put("/admin/users/:userId/block", protect, adminOnly, adminToggleBlock);
router.put("/admin/users/:userId/admin", protect, adminOnly, adminToggleAdmin);

module.exports = router;
