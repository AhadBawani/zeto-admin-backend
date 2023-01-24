const mongoose = require('mongoose');

const UserEmailVerification = new mongoose.Schema({
    otp:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    generatedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("UserEmailVerification", UserEmailVerification);