const CategorySchema = require("../../Schemas/CategorySchema");
const SubCategorySchema = require("../../Schemas/SubCategorySchema");
const CommonUtils = require('../AdminUtils/Common/CommonUtils');

module.exports.GET_SUB_CATEGORY = (async (req, res) => {
    try {
        await SubCategorySchema.find()
            .select('_id categoryId subCategory date')
            .exec()
            .then(response => {
                res.status(200).json(response);
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.ADD_SUB_CATEGORY = (req, res) => {
    const { userId, categoryId, subCategory, sellerId } = req.body;
    try {
        CommonUtils.VERIFY_USER(userId)
            .then(response => {                
                if (response) {
                    CategorySchema.findById(categoryId)
                    .exec()
                    .then(response => {
                        if(response){
                            const SubCategory = new SubCategorySchema({
                                categoryId: categoryId,
                                subCategory: subCategory,
                                sellerId:sellerId
                            }).save();
        
                            SubCategory
                            .then(response => {
                                if(response){
                                    res.status(200).send({
                                        message : "Sub Category Added Successfully!",
                                        SubCategory:{
                                            _id:response._id,
                                            categoryId:response.categoryId,
                                            subCategory:response.subCategory
                                        }
                                    })
                                }
                            })
                            .catch(error => {
                                res.status(400).send(error);
                            });
                        }
                        else{
                            res.status(404).send({
                                message : "Category Not Found!"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            })
            .catch(error => {                
                res.status(400).send({
                    message : "Permission Denied!"
                })
            });
    }
    catch (error) {
        console.log(error);
    }
}