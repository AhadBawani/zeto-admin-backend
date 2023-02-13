const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    interest:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Contact', ContactSchema);