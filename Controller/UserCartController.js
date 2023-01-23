const UserCartSchema = require('../Schemas/UserCartSchema');
const UserSchema = require('../Schemas/UserSchema');

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
    let { userId, productId, quantity } = req.body;

    try {
        UserCartSchema.findOne({ userId: userId, productId: productId })
            .exec()
            .then(async response => {
                if (!response) {
                    const userCart = new UserCartSchema({
                        userId: userId,
                        productId: productId,
                        quantity: quantity
                    })
                    try {
                        await userCart.save();
                        res.status(201).send({
                            message: "Product added to the Cart!"
                        });
                    }
                    catch (err) {
                        res.send("error : ", err);
                    }
                }
                else {                    
                    UserCartSchema.
                        findByIdAndUpdate(response.id, { $inc: { 'quantity': 1 } }, { new: true }, (error, response) => {
                            if (response) {
                                res.status(200).send({
                                    message: "Updated Successfully"
                                });
                            }
                        })
                }
            })
            .catch(error => {
                console.log(error)
            })
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