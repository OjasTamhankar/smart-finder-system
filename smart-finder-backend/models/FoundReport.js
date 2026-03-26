const mongoose = require("mongoose");

const foundReportSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItem",
      required: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120
    },
    contact: {
      type: String,
      trim: true,
      required: true,
      maxlength: 255
    },
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundReport", foundReportSchema);
