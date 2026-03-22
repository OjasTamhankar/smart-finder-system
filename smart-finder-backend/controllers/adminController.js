const LostItem = require("../models/LostItem");
const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");
const {
  sendPushNotification
} = require("../utils/pushNotificationService");

const DEFAULT_FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

const normalizeUrl = value => value.replace(/\/$/, "");

const buildRewardText = reward =>
  reward > 0 ? `${reward}` : "No reward specified";

const buildApprovedItemEmailHtml = item => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
    <h2 style="margin-bottom: 12px;">New Approved Lost Item</h2>
    <p>An item has been approved by the admin and is now visible in Smart Finder.</p>
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

const buildApprovedItemEmailText = item =>
  [
    "New Approved Lost Item",
    "An item has been approved by the admin and is now visible in Smart Finder.",
    `Item Title: ${item.itemName}`,
    item.category ? `Category: ${item.category}` : null,
    `Description: ${item.description || "No description provided"}`,
    `Reward: ${buildRewardText(item.reward)}`
  ]
    .filter(Boolean)
    .join("\n");

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
    const item = await LostItem.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "Pending"
      },
      { status: "Approved" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        message: "Pending item not found"
      });
    }

    try {
      const users = await User.find({}).select("email fcmToken");

      await User.updateMany(
        {},
        {
          $push: {
            notifications: {
              $each: [
                {
                  title: "New approved lost item",
                  message: `${item.itemName} has been approved and is now visible to users.`,
                  itemId: item._id
                }
              ],
              $position: 0,
              $slice: 25
            }
          }
        }
      );

      const recipientEmails = [
        ...new Set(users.map(user => user.email).filter(Boolean))
      ];
      const pushTokens = users
        .map(user => user.fcmToken)
        .filter(Boolean);

      const emailSubject = `New Approved Lost Item: ${item.itemName}`;
      const emailText = buildApprovedItemEmailText(item);
      const emailHtml = buildApprovedItemEmailHtml(item);

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
            `Failed to send ${failedEmails.length} approval email notification(s)`
          );
        }
      }

      if (pushTokens.length > 0) {
        const frontendUrl = normalizeUrl(DEFAULT_FRONTEND_URL);
        const pushResult = await sendPushNotification({
          tokens: pushTokens,
          title: "New Approved Lost Item",
          body: buildPushBody(item),
          data: {
            itemId: item._id,
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
        "Item was approved, but notification delivery failed:",
        notificationError
      );
    }

    res.json({ message: "Item approved" });
  } catch (err) {
    console.error(err);
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
