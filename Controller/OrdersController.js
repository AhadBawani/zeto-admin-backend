const Order = require('../Schemas/OrderSchema');
const Product = require('../Schemas/ProductSchema');
const User = require('../Schemas/UserSchema');
require('dotenv/config');

module.exports.GET_USER_ORDER = (async (req, res) => {
    User.findById(req.params.userId)        
        .exec()
        .then(response => {
            if (response) {
                Order.find({ userId:req.params.userId })
                .populate('productId')                
                .exec()
                .then(response => {
                    if(response){
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
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(response => {
            if (response.deletedCount > 0) {
                res.status(200).send({
                    message: "Deleted Successfully!"
                })
            }
            else {
                res.status(404).send({
                    message: "Order Not Found!"
                })
            }
        })
        .catch(err => {
            res.send({
                message: err.message
            })
        });
})

module.exports.PLACE_ORDER = (async (req, res) => {
    User.findById(req.body.userId)
        .then(async response => {
            if (response) {
                let { product } = req.body;

                for (let i = 0; i < product.length; i++) {
                    Product.findById(product[i]?.productId)
                        .then(response => {
                            if (response) {
                                Order.find({ orderId: { $gt: 0 } })
                                    .exec()
                                    .then(async response => {
                                        if (response.length === 0) {
                                            var order = new Order({
                                                orderId: process.env.START_ORDER,
                                                userId: req.body.userId,
                                                productId: product[i]?.productId,
                                                quantity: product[i]?.quantity,
                                                block: req.body.block,
                                                room: req.body.room,
                                                paymentType: req.body.paymentType,
                                                paymentId: req.body.paymentId,
                                                orderDelivered: req.body.orderDelivered,
                                                date:req.body.date
                                            })
                                            try {
                                                await order.save();
                                            }
                                            catch (err) {
                                                console.log(err)
                                            }
                                        }
                                        else {
                                            var order = new Order({
                                                orderId: response[response.length - 1]?.orderId + 1,
                                                userId: req.body.userId,
                                                productId: product[i]?.productId,
                                                quantity: product[i]?.quantity,
                                                block: req.body.block,
                                                room: req.body.room,
                                                paymentType: req.body.paymentType,
                                                paymentId: req.body.paymentId,
                                                orderDelivered: req.body.orderDelivered,
                                                date:req.body.date
                                            })
                                            try {
                                                await order.save();
                                            }
                                            catch (err) {
                                                console.log(err)
                                            }
                                        }
                                    })
                                    .catch(error => {

                                    })
                            }
                            else {
                                res.status(404).send({
                                    message: "Product Not Found!"
                                })
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
                Order.findOne().sort({ _id : -1 }).limit(1).exec((err, response) => {
                    if(response){
                        res.status(200).send({
                            message : "Order Placed Successfully!",
                            orderId: response.orderId
                        })
                    }
                })
            }
            else {
                res.status(404).send({
                    message: "User not found!"
                })
            }
        })
})

module.exports.ORDER_DELIVERED = (async (req, res) => {
    Order.find({ orderId: req.params.orderId })
        .exec()
        .then(response => {
            if (response.length > 0) {
                Order.updateMany({ orderId: req.params.orderId }, { delivered: true })
                    .exec()
                    .then(response => {
                        console.log(response);
                        res.send("console")
                    })
                    .catch();
            }
            else {
                res.status(404).send({
                    message: "Order Not Found!"
                })
            }
        })
        .catch();
})