const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createLostItem,
  getApprovedLostItems,
  getMyLostItems,
  markItemAsFound
} = require("../controllers/lostController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getApprovedLostItems);
router.post("/", authMiddleware, upload.single("image"), createLostItem);
router.get("/mine", authMiddleware, getMyLostItems);
router.put("/found/:id", authMiddleware, markItemAsFound);

module.exports = router;
