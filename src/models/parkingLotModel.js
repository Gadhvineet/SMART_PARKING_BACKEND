const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  location: {
    address: String,
    city: String,
    pincode: Number
  },

  totalSlots: {
    type: Number,
    required: true
  },

  availableSlots: {
    type: Number,
    required: true
  },

  pricePerHour: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('ParkingLot', parkingLotSchema);