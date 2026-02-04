const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  lostItemId: String,
  finderEmail: String,
  message: String
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
