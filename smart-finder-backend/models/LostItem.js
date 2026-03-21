const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  itemName: String,
  category: {
    type: String,
    default: ""
  },
  description: String,
  location: String,
  contactEmail: String,
  imageUrl: String,
  reward: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    default: "Pending"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("LostItem", lostItemSchema);
