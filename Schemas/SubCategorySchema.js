const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    categoryId:{
        type:String,
        required:true,
        ref:'Category'
    },
    subCategory:{
        type:String,
        required:true
    },
    sellerId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);