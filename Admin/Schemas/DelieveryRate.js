const mongoose = require('mongoose');

const DeliveryRateSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:'User'
    },
    rate:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('DeliveryRate', DeliveryRateSchema);