const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  parkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLot',
    required: true
  },

  slotNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied'],
    default: 'available'
  }

}, { timestamps: true });

/*
IMPORTANT:
This ensures same slot name cannot exist
twice in the same parking lot.
Example:
A1 cannot exist twice in same lot
*/

parkingSlotSchema.index(
  { parkingLot: 1, slotNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);