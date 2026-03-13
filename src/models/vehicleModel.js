const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleType:
    {
        type: String,
        enum: ['car', 'bike', 'bus', 'truck'],
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    colour: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model('Vehicle', vehicleSchema);
    
