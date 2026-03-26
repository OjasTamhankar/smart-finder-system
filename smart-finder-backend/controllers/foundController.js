const FoundReport = require("../models/FoundReport");
const LostItem = require("../models/LostItem");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");
const {
  sendPushNotification
} = require("../utils/pushNotificationService");
const {
  escapeHtml,
  normalizeString,
  isValidObjectId
} = require("../utils/validation");

const DEFAULT_FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

const normalizeUrl = value => value.replace(/\/$/, "");

// CREATE FOUND REPORT + NOTIFICATIONS
exports.createFoundReport = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const lostItem = await LostItem.findById(req.params.id);
    const name = normalizeString(req.body.name);
    const contact = normalizeString(req.body.contact);
    const message = normalizeString(req.body.message);

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    if (!name || !contact) {
      return res.status(400).json({
        message: "Name and contact information are required"
      });
    }

    if (String(lostItem.createdBy) === String(req.user.id)) {
      return res.status(400).json({
        message: "You cannot submit a found report for your own item"
      });
    }

    if (lostItem.status === "Found") {
      return res.status(400).json({
        message: "This item has already been marked as found"
      });
    }

    if (lostItem.status !== "Approved") {
      return res.status(400).json({
        message: "Found reports can only be submitted for approved items"
      });
    }

    const report = await FoundReport.create({
      lostItemId: req.params.id,
      reportedBy: req.user.id,
      name,
      contact,
      message
    });

    try {
      const owner = lostItem.createdBy
        ? await User.findById(lostItem.createdBy).select("fcmToken")
        : null;
      const frontendUrl = normalizeUrl(DEFAULT_FRONTEND_URL);
      const notificationMessage = `${name} shared contact details for ${lostItem.itemName}.`;

      await Promise.allSettled([
        lostItem.createdBy
          ? User.findByIdAndUpdate(lostItem.createdBy, {
              $push: {
                notifications: {
                  $each: [
                    {
                      title: "New found report",
                      message: notificationMessage,
                      itemId: lostItem._id
                    }
                  ],
                  $position: 0,
                  $slice: 25
                }
              }
            })
          : Promise.resolve(),
        lostItem.contactEmail
          ? sendEmail(
              lostItem.contactEmail,
              `Someone may have found your item: ${lostItem.itemName}`,
              [
                "Someone may have found your lost item.",
                `Item: ${lostItem.itemName}`,
                `Name: ${name}`,
                `Contact: ${contact}`,
                `Message: ${message || "N/A"}`
              ].join("\n"),
              `
                <h3>Good News!</h3>
                <p>Your lost item <b>${escapeHtml(lostItem.itemName)}</b> may have been found.</p>
                <p><b>Name:</b> ${escapeHtml(name)}</p>
                <p><b>Contact:</b> ${escapeHtml(contact)}</p>
                <p><b>Message:</b> ${escapeHtml(message || "N/A")}</p>
              `
            )
          : Promise.resolve(),
        owner?.fcmToken
          ? sendPushNotification({
              tokens: [owner.fcmToken],
              title: "Someone may have found your item",
              body: notificationMessage,
              data: {
                itemId: lostItem._id.toString(),
                reportId: report._id.toString(),
                link: `${frontendUrl}/my-lost-items`
              }
            })
          : Promise.resolve()
      ]);
    } catch (notificationError) {
      console.error(
        "Found report was saved, but owner notification delivery failed:",
        notificationError
      );
    }

    return res.status(201).json({ message: "Found report submitted" });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: GET ALL FOUND REPORTS
exports.getAllFoundReports = async (req, res) => {
  try {
    const reports = await FoundReport.find()
      .sort({ createdAt: -1 })
      .populate("lostItemId reportedBy", "itemName email name");

    return res.json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// USER: GET RESPONSES FOR A LOST ITEM
exports.getReportsForLostItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const lostItem = await LostItem.findById(req.params.id).select(
      "createdBy"
    );

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(lostItem.createdBy) !== String(req.user.id)
    ) {
      return res.status(403).json({
        message: "You are not allowed to view these responses"
      });
    }

    const reports = await FoundReport.find({
      lostItemId: req.params.id
    }).sort({ createdAt: -1 });

    return res.json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch responses"
    });
  }
};
