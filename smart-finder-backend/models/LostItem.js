const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: String,
    location: String,
    contactEmail: String,
    imageUrl: String,

    // 🔐 OWNER OF ITEM
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Recovered"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", lostItemSchema);
