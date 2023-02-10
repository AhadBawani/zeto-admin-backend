const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    sellerImage:{
        type:String,
        required:true
    },
    sellerName:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    disabled:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Seller', SellerSchema);