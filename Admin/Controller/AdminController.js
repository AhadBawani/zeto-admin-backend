const Orders = require('../../Schemas/OrderSchema');
const Product = require('../../Schemas/ProductSchema');
const UserSchema = require('../../Schemas/UserSchema');
const utils = require('../AdminUtils/Common/CommonUtils');

module.exports.GET_ALL_ORDERS = (async (req, res) => {
    const { userId } = req.params;
    try {
        utils.VERIFY_USER(userId)
            .then(async response => {
                if (response) {
                    await Orders.find({ deleteOrder: false })
                        .populate('productId')
                        .populate('userId')
                        .exec()
                        .then(response => {
                            if (response) {
                                res.status(200).json(response);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (err) {
        res.send("error : ", err);
    }
})

module.exports.EDIT_PRODUCT = (async (req, res) => {
    const { userId, productName, categoryId, price, sellerID, discount, mrp, description, subCategoryId } = req.body;

    try {
        utils.VERIFY_USER(userId)
            .then(async response => {
                if (response) {
                    await Product.findById(req.params.productId)
                        .exec()
                        .then(async response => {
                            if (response) {
                                let update = {
                                    productName: productName,
                                    productImage: req.file.filename,
                                    price: price,
                                    sellerID: sellerID,
                                    discount: discount,
                                    mrp: mrp,
                                    description: description,
                                    categoryId: categoryId,
                                    subCategoryId: subCategoryId
                                }
                                await Product.findByIdAndUpdate(req.params.productId, update)
                                    .exec()
                                    .then(result => {
                                        if (result) {
                                            res.status(200).send({
                                                message: "Product Edited Successfully!"
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        res.status(400).send(error);
                                    })
                            }
                            else {
                                res.status(404).send({
                                    message: "Product Not Found!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (error) {
        console.log(error)
    }
})

module.exports.ADD_PRODUCT = ((req, res) => {
    const { productName, price, sellerID, categoryId, subCategoryId, description, mrp, discount, disabled, userId } = req.body;
    try {
        utils.VERIFY_USER(userId)
            .then(response => {
                if (response) {
                    const product = new Product({
                        productName: productName,
                        productImage: req.file.filename,
                        price: price,
                        sellerID: sellerID,
                        categoryId: categoryId,
                        subCategoryId: subCategoryId,
                        description: description,
                        mrp: mrp,
                        discount: discount,
                        disabled: disabled
                    }).save();

                    product
                        .then(response => {
                            if (response) {
                                res.status(201).json({
                                    message: "Product Created Successfully!",
                                    product: {
                                        _id: response._id,
                                        productName: response.productName,
                                        productImage: response.productImage,
                                        price: response.price,
                                        sellerName: response.sellerName,
                                        categoryId: response.categoryId,
                                        subCategoryId: response.subCategoryId,
                                        description: response.description,
                                        mrp: response.mrp,
                                        discount: response.discount,
                                        disabled: response.disabled
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            res.status(400).send(error);
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
        res.send(err);
    }
})

module.exports.EDIT_DISABLED_PRODUCT = (async (req, res) => {
    const { productId, result, adminUserId } = req.params;
    try {
        utils.VERIFY_USER(adminUserId)
            .then(response => {
                if (response) {
                    Product.findById(productId)
                        .exec()
                        .then(response => {
                            if (response) {
                                Product.findByIdAndUpdate(productId,
                                    { disabled: result },
                                    { new: true },
                                    (err, result) => {
                                        if (result) {
                                            res.status(200).send({
                                                message: `Product ${result?.disabled ? "disabled" : "enabled"} successfully!`
                                            })
                                        }
                                    })
                            }
                            else {
                                res.status(404).send({
                                    message: "Product Not Found!"
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        });
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            });
    }
    catch (err) {
        console.log("error : ", err);
    }
})

module.exports.DELETE_USER = (async (req, res) => {
    const { adminUserId, userId } = req.params;
    try {
        utils.VERIFY_USER(adminUserId)
            .then(async response => {
                if (response) {
                    await UserSchema.findByIdAndUpdate(userId, { deleteUser: true }, { new: true })
                        .exec()
                        .then(response => {
                            if (response) {
                                res.status(200).send({
                                    message: "User Deleted Successfully!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (err) {
        console.log(err)
    }
})

module.exports.DELIVERED_ORDER = (async (req, res) => {
    const { userId } = req.body;
    try {
        utils.VERIFY_USER(userId)
            .then(response => {
                if (response) {
                    Orders.find({ orderId: req.params.orderId })
                        .exec()
                        .then(response => {
                            if (response) {
                                Orders.updateMany({ orderId: req.params.orderId }, { orderDelivered: true })
                                    .exec()
                                    .then(result => {
                                        if (result) {
                                            res.status(200).send({
                                                message: "Updated Successfully"
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }
                            else {
                                res.status(404).send({
                                    message: "Order not found!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            });
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.DELETE_PRODUCT = (async (req, res) => {
    try {
        Product.deleteOne({ _id: req.params.productId })
            .exec()
            .then(response => {
                if (response?.deletedCount > 0) {
                    res.status(200).send({
                        message: "Product deleted successfully"
                    })
                    UserCart.deleteMany({ productId: req.params.productId });
                }
                else {
                    res.status(404).send({
                        message: "Product Not Found!"
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {
        res.send("Error : ", err);
    }
})
