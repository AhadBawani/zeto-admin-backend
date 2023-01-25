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
    }
})

module.exports = mongoose.model('Seller', SellerSchema);