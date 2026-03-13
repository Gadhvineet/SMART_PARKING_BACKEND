const mongoose = require('mongoose');
const parkingSlotSchema = new mongoose.Schema({
    parkingLot:
    {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'ParkingLot',
        required:true
    },
    slotNumber: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:['available','reserved','occupied'],
        default:'available' 
    }
}, {timestamps: true});

module.exports = mongoose.model('parkingSlot', parkingSlotSchema);