const express = require("express");
const router = express.Router();
const {
  getPendingItems,
  approveItem,
  rejectItem
} = require("../controllers/adminController");

// Get all pending lost items
router.get("/pending", getPendingItems);

// Approve lost item
router.put("/approve/:id", approveItem);

// Reject lost item
router.delete("/reject/:id", rejectItem);

module.exports = router;
