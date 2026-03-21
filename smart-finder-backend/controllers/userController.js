const User = require("../models/User");

exports.saveFcmToken = async (req, res) => {
  try {
    const fcmToken =
      typeof req.body.fcmToken === "string"
        ? req.body.fcmToken.trim()
        : "";

    const update = fcmToken
      ? { fcmToken }
      : { $unset: { fcmToken: 1 } };

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true
    }).select("fcmToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: fcmToken ? "FCM token saved" : "FCM token cleared",
      fcmToken: user.fcmToken || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save FCM token" });
  }
};
