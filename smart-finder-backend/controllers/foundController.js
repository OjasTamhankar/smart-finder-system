const FoundReport = require("../models/FoundReport");
const LostItem = require("../models/LostItem");
const transporter = require("../config/mailer");

// ================= CREATE FOUND REPORT + EMAIL =================
exports.createFoundReport = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Save found report
    await FoundReport.create({
      lostItemId: req.params.id,
      name: req.body.name,
      contact: req.body.contact,
      message: req.body.message
    });

    // Send email to owner
    await transporter.sendMail({
      from: `"Smart Finder" <${process.env.EMAIL_USER}>`,
      to: lostItem.contactEmail,
      subject: "Your lost item has been found!",
      html: `
        <h3>Good News!</h3>
        <p>Your lost item <b>${lostItem.itemName}</b> may have been found.</p>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Contact:</b> ${req.body.contact}</p>
        <p><b>Message:</b> ${req.body.message || "N/A"}</p>
      `
    });

    res.json({ message: "Found report submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN: GET ALL FOUND REPORTS =================
exports.getAllFoundReports = async (req, res) => {
  try {
    const reports = await FoundReport.find().populate("lostItemId");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= USER: GET RESPONSES FOR A LOST ITEM =================
exports.getReportsForLostItem = async (req, res) => {
  try {
    const reports = await FoundReport.find({
      lostItemId: req.params.id
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch responses" });
  }
};
