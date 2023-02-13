const CategorySchema = require("../../Schemas/CategorySchema");
const SubCategorySchema = require("../../Schemas/SubCategorySchema");
const CommonUtils = require('../AdminUtils/Common/CommonUtils');
const SellerSchema = require("../Schemas/SellerSchema");

module.exports.GET_SUB_CATEGORY = (async (req, res) => {
    try {
        await SubCategorySchema.find()
            .select('_id categoryId subCategory date sellerId')
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
                            if (response) {
                                const SubCategory = new SubCategorySchema({
                                    categoryId: categoryId,
                                    subCategory: subCategory,
                                    sellerId: sellerId
                                }).save();

                                SubCategory
                                    .then(response => {
                                        if (response) {
                                            res.status(200).send({
                                                message: "Sub Category Added Successfully!",
                                                SubCategory: {
                                                    _id: response._id,
                                                    categoryId: response.categoryId,
                                                    subCategory: response.subCategory
                                                }
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        res.status(400).send(error);
                                    });
                            }
                            else {
                                res.status(404).send({
                                    message: "Category Not Found!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            })
            .catch(error => {
                res.status(403).send({
                    message : "Permission Denied!"
                })
            });
    }
    catch (error) {
        console.log(error);
    }
}

module.exports.EDIT_SUBCATEGORY = (async (req, res) => {
    const { subCategoryId } = req.params;
    const { categoryId, subCategory, sellerId, userId } = req.body;
    try {
        CommonUtils.VERIFY_USER(userId)
            .then(async response => {
                if (response) {
                    await SubCategorySchema.findById(subCategoryId)
                        .exec()
                        .then(response => {
                            if (response) {
                                CategorySchema.findById(categoryId)
                                    .exec()
                                    .then(response => {
                                        if (response) {
                                            SellerSchema.findById(sellerId)
                                                .exec()
                                                .then(response => {
                                                    if (response) {
                                                        SubCategorySchema.findByIdAndUpdate(subCategoryId, { categoryId: categoryId, subCategory: subCategory, sellerId: sellerId })
                                                            .exec()
                                                            .then(response => {
                                                                if (response) {
                                                                    res.status(200).send({
                                                                        message: "Sub Category Updated successfully!"
                                                                    })
                                                                }
                                                            })
                                                            .catch(error => {
                                                                console.log(error);
                                                            })
                                                    }
                                                    else {
                                                        res.status(404).send({
                                                            message: "Seller not found!"
                                                        })
                                                    }
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                })
                                        }
                                        else {
                                            res.status(404).send({
                                                message: "Category not found!"
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            }
                            else {
                                res.status(404).send({
                                    message: "Sub Category not found!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            })
            .catch(error => {
                res.status(403).send({
                    message : "Permission Denied!"
                })
            })
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})