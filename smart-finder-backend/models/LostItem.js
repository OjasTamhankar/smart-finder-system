const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    trim: true,
    required: true,
    maxlength: 150
  },
  category: {
    type: String,
    default: "",
    trim: true,
    maxlength: 80
  },
  description: {
    type: String,
    trim: true,
    default: "",
    maxlength: 4000
  },
  location: {
    type: String,
    trim: true,
    required: true,
    maxlength: 255
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  reward: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Found"],
    default: "Pending"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LostItem", lostItemSchema);
