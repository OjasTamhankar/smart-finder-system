const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { saveFcmToken } = require("../controllers/userController");

router.post("/save-fcm-token", authMiddleware, saveFcmToken);

module.exports = router;
