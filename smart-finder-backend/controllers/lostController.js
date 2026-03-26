const LostItem = require("../models/LostItem");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");
const {
  escapeHtml,
  normalizeEmail,
  normalizeString,
  isValidEmail,
  isValidObjectId
} = require("../utils/validation");

const escapeRegex = value =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRewardText = reward =>
  reward > 0 ? `${reward}` : "No reward specified";

const buildFoundStatusEmailHtml = item => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
    <h2 style="margin-bottom: 12px;">Lost Item Marked as Found</h2>
    <p>Your lost item status has been updated to <strong>Found</strong>.</p>
    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
      <p style="margin: 0 0 8px;"><strong>Item Title:</strong> ${escapeHtml(item.itemName)}</p>
      <p style="margin: 0 0 8px;"><strong>Description:</strong> ${escapeHtml(item.description || "No description provided")}</p>
      <p style="margin: 0;"><strong>Reward:</strong> ${buildRewardText(item.reward)}</p>
    </div>
  </div>
`;

const buildFoundStatusEmailText = item =>
  [
    "Lost Item Marked as Found",
    `Item Title: ${item.itemName}`,
    `Description: ${item.description || "No description provided"}`,
    `Reward: ${buildRewardText(item.reward)}`
  ].join("\n");

// CREATE LOST ITEM
exports.createLostItem = async (req, res) => {
  try {
    const itemName = normalizeString(req.body.itemName);
    const description = normalizeString(req.body.description);
    const location = normalizeString(req.body.location);
    const reward = Number(req.body.reward || 0);
    const category = normalizeString(req.body.category);
    const owner = await User.findById(req.user.id).select("email");
    const contactEmail = normalizeEmail(
      req.body.contactEmail || owner?.email
    );

    if (!owner) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!itemName) {
      return res.status(400).json({ message: "Item name is required" });
    }

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!isValidEmail(contactEmail)) {
      return res.status(400).json({
        message: "A valid contact email is required"
      });
    }

    if (Number.isNaN(reward) || reward < 0) {
      return res.status(400).json({
        message: "Reward must be a valid non-negative amount"
      });
    }

    const newItem = await LostItem.create({
      itemName,
      category,
      description,
      location,
      contactEmail,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      reward,
      createdBy: req.user.id,
      status: "Pending"
    });

    try {
      await User.updateMany(
        { role: "admin" },
        {
          $push: {
            notifications: {
              $each: [
                {
                  title: "New pending lost item",
                  message: `${newItem.itemName} was submitted${
                    newItem.location ? ` near ${newItem.location}` : ""
                  } and is waiting for approval.`,
                  itemId: newItem._id
                }
              ],
              $position: 0,
              $slice: 25
            }
          }
        }
      );
    } catch (notificationError) {
      console.error(
        "Lost item was created, but admin notification delivery failed:",
        notificationError
      );
    }

    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Failed to create lost item" });
  }
};

// GET APPROVED LOST ITEMS
exports.getApprovedLostItems = async (req, res) => {
  try {
    const {
      category,
      startDate,
      endDate,
      minReward,
      maxReward,
      location,
      search
    } = req.query;

    const query = { status: "Approved" };
    const andConditions = [];

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      const createdAtFilter = {};

      if (startDate) {
        const parsedStartDate = new Date(startDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
          return res
            .status(400)
            .json({ message: "Invalid startDate" });
        }

        parsedStartDate.setUTCHours(0, 0, 0, 0);
        createdAtFilter.$gte = parsedStartDate;
      }

      if (endDate) {
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedEndDate.getTime())) {
          return res
            .status(400)
            .json({ message: "Invalid endDate" });
        }

        parsedEndDate.setUTCHours(23, 59, 59, 999);
        createdAtFilter.$lte = parsedEndDate;
      }

      if (
        createdAtFilter.$gte &&
        createdAtFilter.$lte &&
        createdAtFilter.$gte > createdAtFilter.$lte
      ) {
        return res.status(400).json({
          message: "startDate cannot be later than endDate"
        });
      }

      query.createdAt = createdAtFilter;
    }

    if (minReward !== undefined || maxReward !== undefined) {
      const rewardFilter = {};

      if (minReward !== undefined && minReward !== "") {
        const minimumReward = Number(minReward);

        if (Number.isNaN(minimumReward)) {
          return res
            .status(400)
            .json({ message: "Invalid minReward" });
        }

        rewardFilter.$gte = minimumReward;
      }

      if (maxReward !== undefined && maxReward !== "") {
        const maximumReward = Number(maxReward);

        if (Number.isNaN(maximumReward)) {
          return res
            .status(400)
            .json({ message: "Invalid maxReward" });
        }

        rewardFilter.$lte = maximumReward;
      }

      if (
        rewardFilter.$gte !== undefined &&
        rewardFilter.$lte !== undefined &&
        rewardFilter.$gte > rewardFilter.$lte
      ) {
        return res.status(400).json({
          message: "minReward cannot be greater than maxReward"
        });
      }

      query.reward = rewardFilter;
    }

    if (location) {
      andConditions.push({
        location: {
          $regex: escapeRegex(location),
          $options: "i"
        }
      });
    }

    if (search) {
      const regex = {
        $regex: escapeRegex(search),
        $options: "i"
      };

      andConditions.push({
        $or: [
          { itemName: regex },
          { description: regex },
          { location: regex }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const items = await LostItem.find(query).sort({ createdAt: -1 });

    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch lost items" });
  }
};

// GET MY LOST ITEMS
exports.getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({
      $or: [{ createdBy: req.user.id }, { userId: req.user.id }]
    }).sort({ createdAt: -1 });

    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch user items" });
  }
};

// MARK ITEM AS FOUND
exports.markItemAsFound = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await LostItem.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user.id }, { userId: req.user.id }]
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status === "Found") {
      return res.json({ message: "Item is already marked as found" });
    }

    item.status = "Found";
    await item.save();

    try {
      const owner = await User.findById(item.createdBy).select("email");
      const ownerEmail = item.contactEmail || owner?.email;

      if (ownerEmail) {
        await sendEmail(
          ownerEmail,
          `Item Marked as Found: ${item.itemName}`,
          buildFoundStatusEmailText(item),
          buildFoundStatusEmailHtml(item)
        );
      }
    } catch (notificationError) {
      console.error(
        "Item status was updated, but the found email notification failed:",
        notificationError
      );
    }

    return res.json({ message: "Item marked as found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update item" });
  }
};
