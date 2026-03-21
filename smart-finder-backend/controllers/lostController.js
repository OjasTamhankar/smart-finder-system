const LostItem = require("../models/LostItem");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");
const {
  sendPushNotification
} = require("../utils/pushNotificationService");

const DEFAULT_FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

const escapeRegex = value =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeUrl = value => value.replace(/\/$/, "");

const buildRewardText = reward =>
  reward > 0 ? `${reward}` : "No reward specified";

const buildLostItemEmailHtml = item => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
    <h2 style="margin-bottom: 12px;">New Lost Item Posted</h2>
    <p>A new lost item has been posted in Smart Finder.</p>
    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
      <p style="margin: 0 0 8px;"><strong>Item Title:</strong> ${item.itemName}</p>
      ${
        item.category
          ? `<p style="margin: 0 0 8px;"><strong>Category:</strong> ${item.category}</p>`
          : ""
      }
      <p style="margin: 0 0 8px;"><strong>Description:</strong> ${item.description || "No description provided"}</p>
      <p style="margin: 0;"><strong>Reward:</strong> ${buildRewardText(item.reward)}</p>
    </div>
  </div>
`;

const buildLostItemEmailText = item =>
  [
    "New Lost Item Posted",
    `Item Title: ${item.itemName}`,
    item.category ? `Category: ${item.category}` : null,
    `Description: ${item.description || "No description provided"}`,
    `Reward: ${buildRewardText(item.reward)}`
  ]
    .filter(Boolean)
    .join("\n");

const buildFoundStatusEmailHtml = item => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
    <h2 style="margin-bottom: 12px;">Lost Item Marked as Found</h2>
    <p>Your lost item status has been updated to <strong>Found</strong>.</p>
    <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
      <p style="margin: 0 0 8px;"><strong>Item Title:</strong> ${item.itemName}</p>
      <p style="margin: 0 0 8px;"><strong>Description:</strong> ${item.description || "No description provided"}</p>
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

const buildPushBody = item => {
  const description = (item.description || "").trim();
  const shortenedDescription =
    description.length > 80
      ? `${description.slice(0, 77)}...`
      : description;

  return shortenedDescription
    ? `${item.itemName} - ${shortenedDescription}`
    : item.itemName;
};

// ================= CREATE LOST ITEM =================
exports.createLostItem = async (req, res) => {
  try {
    const reward = Number(req.body.reward || 0);
    const category =
      typeof req.body.category === "string"
        ? req.body.category.trim()
        : "";

    if (Number.isNaN(reward) || reward < 0) {
      return res.status(400).json({
        message: "Reward must be a valid non-negative amount"
      });
    }

    const newItem = await LostItem.create({
      itemName: req.body.itemName,
      category,
      description: req.body.description,
      location: req.body.location,
      contactEmail: req.body.contactEmail,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      reward,
      createdBy: req.user.id,
      status: "Pending"
    });

    await User.updateMany(
      {},
      {
        $push: {
          notifications: {
            $each: [
              {
                title: "New lost item post",
                message: `${newItem.itemName} was posted${
                  newItem.location ? ` near ${newItem.location}` : ""
                }.`,
                itemId: newItem._id
              }
            ],
            $position: 0,
            $slice: 25
          }
        }
      }
    );

    try {
      const users = await User.find({}).select("email fcmToken");
      const recipientEmails = [
        ...new Set(users.map(user => user.email).filter(Boolean))
      ];
      const pushTokens = users
        .map(user => user.fcmToken)
        .filter(Boolean);
      const frontendUrl = normalizeUrl(DEFAULT_FRONTEND_URL);

      const emailSubject = `New Lost Item Posted: ${newItem.itemName}`;
      const emailText = buildLostItemEmailText(newItem);
      const emailHtml = buildLostItemEmailHtml(newItem);

      if (recipientEmails.length > 0) {
        const emailResults = await Promise.allSettled(
          recipientEmails.map(email =>
            sendEmail(email, emailSubject, emailText, emailHtml)
          )
        );

        const failedEmails = emailResults.filter(
          result => result.status === "rejected"
        );

        if (failedEmails.length > 0) {
          console.error(
            `Failed to send ${failedEmails.length} lost item email notifications`
          );
        }
      }

      if (pushTokens.length > 0) {
        const pushResult = await sendPushNotification({
          tokens: pushTokens,
          title: "New Lost Item Posted",
          body: buildPushBody(newItem),
          data: {
            itemId: newItem._id,
            link: `${frontendUrl}/lost-items`
          }
        });

        if (pushResult.invalidTokens.length > 0) {
          await User.updateMany(
            { fcmToken: { $in: pushResult.invalidTokens } },
            { $unset: { fcmToken: 1 } }
          );
        }
      }
    } catch (notificationError) {
      console.error(
        "Lost item was created, but notification delivery failed:",
        notificationError
      );
    }

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create lost item" });
  }
};

// ================= GET APPROVED LOST ITEMS =================
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

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch lost items" });
  }
};

// ================= GET MY LOST ITEMS =================
exports.getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({
      $or: [
        { createdBy: req.user.id },
        { userId: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user items" });
  }
};

// ================= MARK ITEM AS FOUND =================
exports.markItemAsFound = async (req, res) => {
  try {
    const item = await LostItem.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { createdBy: req.user.id },
          { userId: req.user.id }
        ]
      },
      { status: "Found" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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

    res.json({ message: "Item marked as found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update item" });
  }
};
