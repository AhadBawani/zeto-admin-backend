const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    sellerID:{
        type:String,
        required:true,
        ref:'Seller'
    },
    category:{
        type:String,
        required:true
    },
    mainCategory:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    disabled:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model('Product', ProductSchema);