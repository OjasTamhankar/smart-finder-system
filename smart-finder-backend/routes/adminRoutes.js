const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getPendingItems,
  approveItem,
  rejectItem
} = require("../controllers/adminController");

router.use(authMiddleware, adminMiddleware);

router.get("/pending", getPendingItems);
router.put("/approve/:id", approveItem);
router.delete("/reject/:id", rejectItem);

module.exports = router;
