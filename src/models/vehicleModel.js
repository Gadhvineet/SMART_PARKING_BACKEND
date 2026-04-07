const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    vehicleName: {
        type: String,
        required: true,
        trim: true
    },

    vehicleType: {
        type: String,
        enum: ['2-wheeler', '3-wheeler', '4-wheeler'],
        required: true
    },

    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true
    },

    colour: {
        type: String,
        trim: true
    },

    image: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);