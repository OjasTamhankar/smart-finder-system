const express = require("express");
const router = express.Router();

const {
  createFoundReport,
  getAllFoundReports,
  getReportsForLostItem
} = require("../controllers/foundController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/:id", authMiddleware, createFoundReport);
router.get("/", authMiddleware, adminMiddleware, getAllFoundReports);
router.get("/item/:id", authMiddleware, getReportsForLostItem);

module.exports = router;
