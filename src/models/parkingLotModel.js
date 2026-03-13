const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({  
    name: {
        type:string,
        required:true
    },
    locaiton: {
        address: string,
        city: string,
        pincide: number
    },
    totalSlots: {
        type: number,
        required: true
    },
    availableSlots: {
        type: number,
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
