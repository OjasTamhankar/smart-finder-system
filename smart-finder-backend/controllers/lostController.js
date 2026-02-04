const LostItem = require("../models/LostItem");

// ================= CREATE LOST ITEM =================
exports.createLostItem = async (req, res) => {
  try {
    const newItem = await LostItem.create({
      itemName: req.body.itemName,
      description: req.body.description,
      location: req.body.location,
      contactEmail: req.body.contactEmail,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.id,
      status: "Pending"
    });

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create lost item" });
  }
};

// ================= GET APPROVED LOST ITEMS =================
exports.getApprovedLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({ status: "Approved" });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lost items" });
  }
};

// ================= GET MY LOST ITEMS =================
exports.getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user items" });
  }
};

// ================= MARK ITEM AS FOUND =================
exports.markItemAsFound = async (req, res) => {
  try {
    await LostItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "Found" }
    );

    res.json({ message: "Item marked as found" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item" });
  }
};
