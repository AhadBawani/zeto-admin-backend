const ProductSchema = require('../Schemas/ProductSchema');
const UserCartSchema = require('../Schemas/UserCartSchema');
const UserSchema = require('../Schemas/UserSchema');
const utils = require('../Utils/utils');

module.exports.GET_USER_CART = (async (req, res) => {
    try {
        UserSchema.findById(req.params.userId)
            .exec()
            .then(response => {
                if (response) {
                    UserCartSchema.find({ userId: req.params.userId })
                        .select('_id productId quantity')
                        .populate('productId', '_id productName productImage price category description mrp discount disabled')
                        .exec()
                        .then(docs => {
                            res.status(200).json({
                                cart: docs
                            })
                        })
                        .catch();
                }
                else {
                    res.status(404).send({
                        message: "User Not Found!"
                    })
                }
            })
            .catch(err => {
                res.send({
                    message: err.message
                })
            });
    }
    catch (err) {
        res.send("Error : ", err);
    }
})

module.exports.ADD_USER_CART = (async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        await UserSchema.findById(userId)
            .exec()
            .then(userResponse => {
                if (userResponse) {
                    ProductSchema.findById(productId)
                        .exec()
                        .then(productResponse => {
                            if (productResponse) {
                                UserCartSchema.findOne({ userId: userId }).sort({ id: -1 })
                                    .exec()
                                    .then(userCartResponse => {
                                        if (userCartResponse) {
                                            if (userCartResponse.currentSellerId === productResponse.sellerID) {
                                                if (userCartResponse.productId === productId) {
                                                    UserCartSchema.
                                                        findByIdAndUpdate(userCartResponse.id, { $inc: { 'quantity': 1 } }, { new: true }, (error, response) => {
                                                            if (response) {
                                                                res.status(200).send({
                                                                    message: "Updated Successfully"
                                                                });
                                                            }
                                                        })
                                                }
                                                else {
                                                    const userCartAddResponse = utils.ADD_TO_CART(userId, productId, quantity, productResponse.sellerID);
                                                    userCartAddResponse
                                                        .then(response => {
                                                            if (response) {
                                                                res.status(200).send({
                                                                    message: "Product added to the cart!"
                                                                })
                                                            }
                                                        })
                                                        .catch(error => {
                                                            res.status(400).send(error);
                                                        });
                                                }
                                            }
                                            else {
                                                UserCartSchema.remove({ userId: userId, currentSellerId: userCartResponse.currentSellerId })
                                                    .exec()
                                                    .then(response => {
                                                        if (response.deletedCount > 0) {
                                                            const userCartAddResponse = utils.ADD_TO_CART(userId, productId, quantity, productResponse.sellerID);
                                                            userCartAddResponse
                                                                .then(response => {
                                                                    if (response) {
                                                                        res.status(200).send({
                                                                            message: "Product added to the cart!"
                                                                        })
                                                                    }
                                                                })
                                                                .catch(error => {
                                                                    res.status(400).send(error);
                                                                });
                                                        }
                                                    })
                                                    .catch(error => {
                                                        if (error) {
                                                            console.log(error);
                                                        }
                                                    });
                                            }
                                        }
                                        else {
                                            const userCartAddResponse = utils.ADD_TO_CART(userId, productId, quantity, productResponse.sellerID);
                                            userCartAddResponse
                                                .then(response => {
                                                    if (response) {
                                                        res.status(200).send({
                                                            message: "Product added to the cart!"
                                                        })
                                                    }
                                                })
                                                .catch(error => {
                                                    res.status(400).send(error);
                                                });
                                        }
                                    })
                                    .catch(error => {
                                        if (error) {
                                            console.log(error);
                                        }
                                    });
                            }
                            else {
                                res.status(404).send({
                                    message: "Product not found!"
                                })
                            }
                        })
                        .catch(error => {
                            if (error) {
                                console.log(error)
                            }
                        });
                }
                else {
                    res.status(404).send({
                        message: "User not found!"
                    })
                }
            })
            .catch(error => {
                if (error) {
                    console.log(error);
                }
            });
    }
    catch (err) {
        console.log(err);
    }
})

module.exports.ADD_CART_QUANTITY = (async (req, res) => {
    try {
        UserCartSchema.findById(req.params.cartId)
            .exec()
            .then(response => {
                if (response) {
                    UserCartSchema.
                        findByIdAndUpdate(req.params.cartId, { $inc: { 'quantity': 1 } }, { new: true }, (error, response) => {
                            if (response) {
                                res.status(200).send({
                                    message: "Updated Successfully"
                                });
                            }
                        })
                }
                else {
                    res.status(404).send({
                        message: "User Cart Not Found!"
                    })
                }
            })
            .catch(err => {
                res.send({
                    message: err.messgae
                })
            });
    }
    catch (err) {
        res.send("error : ", err);
    }
})

module.exports.REMOVE_CART_QUANTITY = (async (req, res) => {
    try {
        UserCartSchema.findById(req.params.cartId)
            .exec()
            .then(response => {
                if (response?.quantity == 1) {
                    try {
                        UserCartSchema.deleteOne({ _id: req.params.cartId })
                            .exec()
                            .then(doc => {
                                if (doc.deletedCount > 0) {
                                    res.status(200).send({
                                        message: "Deleted Successfully"
                                    });
                                }
                                else {
                                    res.status(404).send({
                                        message: "User Cart Not Found!"
                                    })
                                }
                            })
                            .catch();
                    }
                    catch (err) {
                        res.send("error : ", err);
                    }
                }
                else if (response) {
                    UserCartSchema.
                        findByIdAndUpdate(req.params.cartId, { $inc: { 'quantity': -1 } }, { new: true }, (error, response) => {
                            if (response) {
                                res.status(200).send({
                                    message: "removed quantity successfully!"
                                });
                            }
                        })
                }
                else {
                    res.status(404).send({
                        message: "User Cart Not Found!"
                    })
                }
            })
            .catch(err => {
                res.send({
                    message: err.message
                })
            });
    }
    catch (err) {
        res.send("error : ", err);
    }
})

module.exports.REMOVE_USER_CART = (async (req, res) => {
    try {
        UserCartSchema.findById(req.params.cartId).remove()
            .exec()
            .then(doc => {
                if (doc.deletedCount > 0) {
                    res.status(200).send({
                        message: "Deleted Successfully"
                    });
                }
                else {
                    res.status(404).send({
                        message: "User Cart Not Found!"
                    })
                }
            })
            .catch();
    }
    catch (err) {
        res.send("error : ", err);
    }
})