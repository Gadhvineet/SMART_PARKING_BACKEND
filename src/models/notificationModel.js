const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["success", "warning", "error", "info"],
      default: "info"
    },
    read: {
      type: Boolean,
      default: false
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
