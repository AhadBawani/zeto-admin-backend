const mongoose = require('mongoose');

const UserCartSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        ref:'Product',
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('UserCart', UserCartSchema);