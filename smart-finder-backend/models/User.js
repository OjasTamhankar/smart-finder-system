const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LostItem",
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  fcmToken: {
    type: String,
    default: null
  },
  notifications: {
    type: [notificationSchema],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
