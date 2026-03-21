const User = require("../models/User");

exports.getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.notifications || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notifications.forEach(notification => {
      notification.isRead = true;
    });

    await user.save();

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};
