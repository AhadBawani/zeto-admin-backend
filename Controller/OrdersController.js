const Order = require('../Schemas/OrderSchema');
const UserCartSchema = require('../Schemas/UserCartSchema');
const User = require('../Schemas/UserSchema');
const DelieveryRate = require('../Admin/Schemas/DelieveryRate');
const ProductSchema = require('../Schemas/ProductSchema');
require('dotenv/config');

module.exports.GET_USER_ORDER = (async (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(response => {
            if (response) {
                Order.find({ userId: req.params.userId })
                    .populate('productId')
                    .exec()
                    .then(response => {
                        if (response) {
                            res.status(200).json(response)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
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
})


module.exports.DELETE_ORDER = (async (req, res) => {
    const orderId = req.params.orderId;

    await Order.find({ orderId: orderId })
        .exec()
        .then(response => {
            if (response) {
                Order.updateMany({ orderId: orderId }, { deleteOrder: true }, { new: true })
                    .exec()
                    .then(response => {
                        if (response.modifiedCount > 0) {
                            res.status(200).send({
                                message: "Order Deleted successfully!"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            else {
                res.status(404).send({
                    message: "Order not found!"
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
})

module.exports.PLACE_ORDER = (async (req, res) => {
    const { userId, product, block, room, paymentType, orderDelivered } = req.body;
    let { date } = req.body;
    const today = new Date();
    var changeDate = null;
    const currentHour = today.getHours();
    if ((currentHour > process.env.LAST_ORDER_TIME) | (currentHour == process.env.LAST_ORDER_TIME && today.getMinutes() > 1)) {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        changeDate = tomorrow.getDate() + "/" + ((tomorrow.getMonth() + 1) > 10 ? tomorrow.getMonth() + 1 : "0" + (tomorrow.getMonth() + 1)) + "/" + tomorrow.getFullYear();
    }
    else {
        changeDate = date;
    }
    try {
        User.findById(userId)
            .then(async userResponse => {
                if (userResponse) {
                    DelieveryRate.findOne().sort({ _id: -1 })
                        .exec()
                        .then(deliveryResponse => {
                            if (deliveryResponse) {
                                Order.findOne({}, {}, { sort: { '_id': -1 } }).select('orderId')
                                    .exec()
                                    .then(orderResponse => {
                                        if (orderResponse) {
                                            for (let i = 0; i < product.length; i++) {
                                                ProductSchema.findById(product[i].productId)
                                                    .exec()
                                                    .then(productResponse => {
                                                        if (productResponse) {
                                                            const order = new Order({
                                                                orderId: (orderResponse.orderId + 1),
                                                                userId: userId,
                                                                productId: product[i]?.productId,
                                                                quantity: product[i]?.quantity,
                                                                block: block,
                                                                total: (productResponse.price * product[i].quantity),
                                                                deliveryRate: deliveryResponse.rate,
                                                                room: room,
                                                                paymentType: paymentType,
                                                                orderDelivered: orderDelivered,
                                                                date: changeDate,
                                                            }).save();                                                            
                                                        }
                                                        else {
                                                            res.status(400).send({
                                                                message: "Product not found!"
                                                            })

                                                        }
                                                    })
                                            }
                                            res.status(200).send({
                                                orderId: (orderResponse.orderId + 1),
                                                message: "Order placed successfully!"
                                            })
                                        }
                                        else {
                                            for (let i = 0; i < product.length; i++) {
                                                ProductSchema.findById(product[i].productId)
                                                    .exec()
                                                    .then(productResponse => {
                                                        if (productResponse) {
                                                            const order = new Order({
                                                                orderId: process.env.START_ORDER,
                                                                userId: userId,
                                                                productId: product[i]?.productId,
                                                                quantity: product[i]?.quantity,
                                                                block: block,
                                                                total: (productResponse.price * product[i].quantity),
                                                                deliveryRate: deliveryResponse.rate,
                                                                room: room,
                                                                paymentType: paymentType,
                                                                orderDelivered: orderDelivered,
                                                                date: changeDate,
                                                            }).save();
                                                        }
                                                        else {
                                                            res.status(400).send({
                                                                message: "Product not found!"
                                                            })

                                                        }
                                                    })
                                            }
                                            res.status(200).send({
                                                orderId: parseInt(process.env.START_ORDER),
                                                message: "Order placed successfully!"
                                            })
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            }                            
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    UserCartSchema.remove({ userId: userId })
                        .exec()
                        .then(cartResponse => {
                            console.log(cartResponse);
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else {
                    res.status(404).send({
                        message: "User not found!"
                    })
                }
            })
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.ORDER_DELIVERED = (async (req, res) => {
    Order.find({ orderId: req.params.orderId }, { deleteOrder: false })
        .exec()
        .then(response => {
            if (response.length > 0) {
                Order.updateMany({ orderId: req.params.orderId }, { orderDelivered: true })
                    .exec()
                    .then(response => {
                        if (response.modifiedCount > 0) {
                            res.status(200).send({
                                message: "Updated successfully!"
                            })
                        }
                    })
                    .catch();
            }
            else {
                res.status(404).send({
                    message: "Order Not Found!"
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
})

