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
    const userCart = new UserCartSchema({
        userId: req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity
    })
    try {
        await userCart.save();
        res.status(201).send({
            message : "Product added to the Cart!"
        });
    }
    catch (err) {
        res.send("error : ", err);
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
                if (response) {
                    UserCartSchema.
                        findByIdAndUpdate(req.params.cartId, { $inc: { 'quantity': -1 } }, { new: true }, (error, response) => {
                            if (response) {
                                res.status(200).send({
                                    message : "removed quantity successfully!"
                                });                                
                            }
                        })
                }
                else{
                    res.status(404).send({
                        message : "User Cart Not Found!"
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
                else{
                    res.status(404).send({
                        message : "User Cart Not Found!"
                    })
                }
            })
            .catch();
    }
    catch (err) {
        res.send("error : ", err);
    }
})