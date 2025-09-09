const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // your multer file

// Single image upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Return relative path to frontend
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
