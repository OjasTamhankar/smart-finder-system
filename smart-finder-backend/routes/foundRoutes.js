const express = require("express");
const router = express.Router();

const {
  createFoundReport,
  getAllFoundReports,
  getReportsForLostItem
} = require("../controllers/foundController");

const authMiddleware = require("../middleware/authMiddleware");

// Submit found report
router.post("/:id", createFoundReport);

// Admin: view all found reports
router.get("/", authMiddleware, getAllFoundReports);

// User: view responses for a lost item
router.get("/item/:id", authMiddleware, getReportsForLostItem);

module.exports = router;
