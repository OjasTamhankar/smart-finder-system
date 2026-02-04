const mongoose = require("mongoose");

const foundReportSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LostItem",
      required: true
    },
    name: String,
    contact: String,
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundReport", foundReportSchema);
