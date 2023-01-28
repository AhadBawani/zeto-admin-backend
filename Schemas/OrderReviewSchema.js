const { default: mongoose } = require("mongoose");

const OrderReviewSchema = new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
        unique:true,
        ref:'Order'
    },
    userId:{
        type:String,
        required:true,
        ref:'User'
    },
    review:{
        type:String,
        required:true,        
    },
    rating:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now(),
    }    
})

module.exports = mongoose.model('OrderReview', OrderReviewSchema);