const User = require("../models/User");
const { normalizeString } = require("../utils/validation");

exports.saveFcmToken = async (req, res) => {
  try {
    const fcmToken = normalizeString(req.body.fcmToken);

    if (fcmToken && fcmToken.length > 4096) {
      return res.status(400).json({ message: "Invalid FCM token" });
    }

    if (fcmToken) {
      await User.updateMany(
        {
          _id: { $ne: req.user.id },
          fcmToken
        },
        { $unset: { fcmToken: 1 } }
      );
    }

    const update = fcmToken
      ? { fcmToken }
      : { $unset: { fcmToken: 1 } };

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true
    }).select("fcmToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: fcmToken ? "FCM token saved" : "FCM token cleared",
      fcmToken: user.fcmToken || null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to save FCM token" });
  }
};
