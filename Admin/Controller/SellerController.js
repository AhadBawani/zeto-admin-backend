const SellerReviewSchema = require('../../Schemas/SellerReviewSchema');
const SellerSchema = require('../Schemas/SellerSchema');
const ProductSchema = require('../../Schemas/ProductSchema');
const Seller = require('../Schemas/SellerSchema');
const utils = require('../AdminUtils/Common/CommonUtils');
const CategorySchema = require('../../Schemas/CategorySchema');

module.exports.GET_ALL_SELLER = (async (req, res) => {
    try {
        const arr = [];
        let seller = await Seller.find().select('_id sellerName sellerImage date categoryId').populate('categoryId', 'category');

        for (let i = 0; i < seller.length; i++) {
            const sellerReview = await SellerReviewSchema.find({ sellerId: seller[i]?._id, deleteReview: false }).populate('userId', 'email username phoneNumber');
            const sellerProduct = await (await ProductSchema.find({ sellerID: seller[i]?._id }).populate('categoryId', 'category').populate('subCategoryId', 'subCategory'));
            if (sellerReview.length > 0) {
                let total = 0;
                sellerReview.map((item) => {
                    total += item?.rating;
                })

                var average = Math.round(total / sellerReview.length);
            }
            let obj = {
                seller: seller[i],
                review: sellerReview,
                averageRating: sellerReview.length > 0 ? average : 0,
                product: sellerProduct
            }
            arr.push(obj);
        }
        res.status(200).json(arr);
    }
    catch (err) {
        console.log(err)
    }
})

module.exports.ADD_SELLER = (async (req, res) => {
    const { sellerName, date, categoryId, userId } = req.body;
    try {
        utils.VERIFY_USER(userId)
            .then(response => {
                if (response) {
                    CategorySchema.findById(categoryId)
                        .exec()
                        .then(categoryResponse => {
                            if (categoryResponse) {
                                if (categoryResponse.category !== 'Food' && req.files['sellerCoverImage']) {
                                    res.status(400).send({
                                        message: "Only Food category seller can have cover image!"
                                    })
                                }
                                const seller = new Seller({
                                    sellerName: sellerName,
                                    sellerImage: req.files['sellerImage'][0].filename,
                                    date: date,
                                    categoryId: categoryId
                                });
                                if (categoryResponse.category === 'Food' && req.files['sellerCoverImage']) {
                                    seller.sellerCoverImage = req.files['sellerCoverImage'][0].filename;
                                }
                                seller.save()
                                    .then(response => {
                                        if (response) {
                                            res.status(201).json({
                                                message: "Seller Created Successfully!",
                                                seller: {
                                                    _id: response._id,
                                                    sellerName: response.sellerName,
                                                    sellerImage: response.sellerImage,
                                                    sellerCoverImage: response.sellerCoverImage,
                                                    date: response.date,
                                                    categoryId: response.categoryId,
                                                    disabled: response.disabled
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
                                    message: "Category not found!"
                                })
                            }
                        })
                        .catch(error => {
                            res.status(400).json(error);
                        })
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (err) {
        res.send(err)
    }
})

module.exports.DELETE_SELLER = (async (req, res) => {
    const sellerId = req.params.sellerId;
    try {
        await SellerSchema.findByIdAndDelete(sellerId)
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).send({
                        message: "User deleted successfully!"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports.DISABLED_SELLER = (async (req, res) => {
    const { sellerId, result } = req.params;

    try {
        await SellerSchema.findOne({ _id: sellerId })
            .exec()
            .then(async response => {
                if (response) {
                    await SellerSchema.findByIdAndUpdate(sellerId, { disabled: result }, { new: true })
                        .exec()
                        .then(async response => {
                            if (response) {
                                await ProductSchema.updateMany({ sellerID: sellerId }, { disabled: result })
                                    .exec()
                                    .then(response => {
                                        if (response) {
                                            res.status(200).send({
                                                message: "Updated Successfully!"
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
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
            });
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.EDIT_SELLER = (async (req, res) => {
    const sellerId = req.params.sellerId;
    const { sellerName, categoryId, userId } = req.body;

    try {
        utils.VERIFY_USER(userId)
            .then(async response => {
                await SellerSchema.findById(sellerId)
                    .exec()
                    .then(sellerResponse => {
                        if (sellerResponse) {
                            CategorySchema.findById(categoryId)
                                .exec()
                                .then(categoryResponse => {
                                    const updateSeller = {
                                        sellerName: sellerName,
                                        categoryId: categoryId,                                        
                                        sellerImage: req.files['sellerImage'] ? req.files['sellerImage'][0].filename : sellerResponse.sellerImage
                                    }

                                    if (req.files['sellerCoverImage'] && categoryResponse.category === "Food") {
                                        updateSeller.sellerCoverImage = req.files['sellerCoverImage'][0].filename;                                        
                                    }                                    
                                    SellerSchema.findByIdAndUpdate(sellerId, updateSeller, { new: true })
                                        .exec()
                                        .then(response => {
                                            if (response) {
                                                res.status(200).send({
                                                    message: "Seller Updated Successfully!",
                                                    seller:response
                                                })
                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        })
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
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
            })
            .catch(error => {
                res.status(400).send({
                    message: "Permission Deined!"
                })
            });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})