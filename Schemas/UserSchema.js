const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String        
    },
    deleteUser:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('User', UserSchema);