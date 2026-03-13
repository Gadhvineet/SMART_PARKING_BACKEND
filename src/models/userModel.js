const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },      
    email: {
        type : String,
        required: true, 
        unique: true        
    },
    password: {
        type : String,
        re,quired: true      
    },
    role: {
        type : String,
        enum: ['user', 'admin'],
        default: 'user'
    },
     status:{
        type:String,
        default:"inactive",
        enum:["active","inactive","deleted","blocked"]
    }
})  

module.exports = mongoose.model('User', userSchema);