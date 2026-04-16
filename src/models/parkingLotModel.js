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
  },

  supportedVehicleTypes: {
    type: [String],
    enum: ['2-wheeler', '3-wheeler', '4-wheeler'],
    default: ['2-wheeler', '3-wheeler', '4-wheeler']
  }

}, { timestamps: true });

module.exports = mongoose.model('ParkingLot', parkingLotSchema);