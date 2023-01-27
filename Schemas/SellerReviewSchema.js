const mongoose = require('mongoose');

const SellerReview = new mongoose.Schema({
    sellerId:{
        type:String,
        required:true,
        ref:'Seller'
    },
    userId:{
        type:String,
        required:true,
        ref:'User'
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('SellerReview', SellerReview);