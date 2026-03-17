const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({  
    name: {
        type: String,
        required:true
    },
    locaiton: {
        address: String,
        city: String,
        pincide: Number
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
},
{ timestamps: true }
);


module.exports = mongoose.model('ParkingLot', parkingLotSchema);
