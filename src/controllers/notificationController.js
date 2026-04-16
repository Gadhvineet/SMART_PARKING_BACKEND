const Notification = require("../models/notificationModel");

// ==============================
// GET USER NOTIFICATIONS
// ==============================
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message
    });
  }
};

// ==============================
// MARK SINGLE NOTIFICATION AS READ
// ==============================
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notification",
      error: error.message
    });
  }
};

// ==============================
// MARK ALL AS READ
// ==============================
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      message: "All notifications marked as read"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notifications",
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
