const LostItem = require("../models/LostItem");

// GET ALL PENDING LOST ITEMS
exports.getPendingItems = async (req, res) => {
  try {
    const items = await LostItem.find({ status: "Pending" });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending items" });
  }
};

// APPROVE LOST ITEM
exports.approveItem = async (req, res) => {
  try {
    await LostItem.findByIdAndUpdate(req.params.id, {
      status: "Approved"
    });

    res.json({ message: "Item approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

// REJECT LOST ITEM
exports.rejectItem = async (req, res) => {
  try {
    await LostItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item rejected" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
};
