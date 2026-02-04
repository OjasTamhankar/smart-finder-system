const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createLostItem,
  getApprovedLostItems,
  getMyLostItems,
  markItemAsFound
} = require("../controllers/lostController");

const authMiddleware = require("../middleware/authMiddleware");

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Public – approved lost items
router.get("/", getApprovedLostItems);

// User – post lost item
router.post("/", authMiddleware, upload.single("image"), createLostItem);

// User – my lost items
router.get("/mine", authMiddleware, getMyLostItems);

// User – mark item as found
router.put("/found/:id", authMiddleware, markItemAsFound);

module.exports = router;
