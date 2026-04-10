const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  parkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingLot",
    required: true
  },

  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSlot",
    required: true
  },

  timePeriod: {
    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    }
  },

  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);