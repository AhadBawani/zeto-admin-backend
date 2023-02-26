const DelieveryRate = require('../Admin/Schemas/DelieveryRate');
const Order = require('../Schemas/OrderSchema');
const ProductSchema = require('../Schemas/ProductSchema');
const nodemailer = require('nodemailer');
const UserCartSchema = require('../Schemas/UserCartSchema');
const User = require('../Schemas/UserSchema');
require('dotenv/config');

module.exports.GET_USER_ORDER = (async (req, res) => {
    const userId = req.params.userId;
    const arr = [];
    User.findById(userId)
        .exec()
        .then(response => {
            if (response) {
                Order.find({ userId: userId })
                    .populate('productId')
                    .exec()
                    .then(response => {
                        if (response.length) {
                            for (let i = 0; i < response.length; i++) {
                                const orderProduct = [];
                                const orderPrice = [];
                                const orderQauntity = [];
                                const order = response.filter((item) => item?.orderId === response[i].orderId);
                                order.map((item) => {
                                    orderProduct.push({
                                        productId: item.productId._id,
                                        productName: item.productId.productName,
                                        productImage: item.productId.productImage,
                                        price: item.productId.price,
                                        mrp: item.productId.mrp,
                                        discount: item.productId.discount,
                                        disabled: item.productId.disabled
                                    });
                                    orderQauntity.push(item.quantity);
                                    orderPrice.push(item.productId.price);
                                })

                                const obj = {
                                    orderId: response[i].orderId,
                                    product: orderProduct,
                                    price: orderPrice,
                                    quantity: orderQauntity,
                                    block: response[i].block,
                                    room: response[i].room,
                                    date: response[i].date,
                                    orderDelivered: response[i].orderDelivered,
                                    orderReview: response[i].orderReview,
                                    deleteOrder: response[i].deleteOrder
                                }

                                arr.push(obj);
                            }
                            const userOrders = [...new Map(arr.map(v => [v.orderId, v])).values()];
                            res.status(200).send(userOrders);
                        }
                        else {
                            res.status(200).send({
                                message: "No user orders!"
                            })
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
    var date = req.body.date;
    const today = new Date();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const productArr = [];
    const currentHour = today.getHours();    
    if((currentHour > process.env.LAST_ORDER_TIME) | (currentHour == process.env.LAST_ORDER_TIME && today.getMinutes() > 1)){
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        date = tomorrow.getDate() + "/" + ((tomorrow.getMonth() + 1) > 10 ? tomorrow.getMonth() + 1 : "0" + (tomorrow.getMonth() + 1)) + "/" + tomorrow.getFullYear();
    }
    else{
        date = date;
    }    
    try {
        await User.findById(userId)
            .exec()
            .then(userResponse => {
                if (userResponse) {
                    Order.findOne({}, {}, { sort: { '_id': -1 } }).select('orderId')
                        .exec()
                        .then(response => {
                            if (response) {
                                for (let i = 0; i < product.length; i++) {
                                    ProductSchema.findById(product[i].productId)
                                        .exec()
                                        .then(productResponse => {
                                            if (productResponse) {

                                                DelieveryRate.findOne().sort({ _id: -1 })
                                                    .exec()
                                                    .then(deliveryResponse => {
                                                        const order = new Order({
                                                            orderId: (response.orderId + 1),
                                                            userId: userId,
                                                            productId: product[i]?.productId,
                                                            quantity: product[i]?.quantity,
                                                            block: block,
                                                            total: (productResponse.price * product[i].quantity),
                                                            deliveryRate: deliveryResponse.rate,
                                                            room: room,
                                                            paymentType: paymentType,
                                                            orderDelivered: orderDelivered,
                                                            date: date,
                                                        }).save();

                                                        UserCartSchema.findOneAndRemove({ productId: product[i].productId })
                                                        .exec()
                                                        .then(response => console.log(response));
                                                    })
                                                    .catch(error => {
                                                        res.status(400).send(error);
                                                    })
                                            }
                                            else {
                                                res.status(400).send({
                                                    message: "Product not found!"
                                                })
                                            }
                                        })
                                        .catch(error => {
                                            res.status(400).send(error);
                                        })
                                }                                
                                const mailOptions = {
                                    from: 'ahadbawani123@gmail.com',
                                    to: userResponse.email,
                                    subject: 'Order Confirmation',
                                    text: `Dear customer,
                                    Thank you for your order. Your order ID is ${(response.orderId + 1)}
                                    your order will be delivered on ${date} between 7pm to 9pm

                                    Thank you for shopping with us
                                    
                                    
                                    Best regards,
                                    Zetomart`
                                };
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                    else {
                                        console.log("Email sended successfully");
                                    }
                                })
                                res.status(200).send({
                                    orderId: (response.orderId + 1),
                                    message: "Order placed successfully!"
                                })
                            }
                            else {
                                for (let i = 0; i < product.length; i++) {
                                    ProductSchema.findById(product[i].productId)
                                        .exec()
                                        .then(productResponse => {
                                            if (productResponse) {
                                                DelieveryRate.findOne().sort({ _id: -1 })
                                                    .exec()
                                                    .then(deliveryResponse => {
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
                                                            date: date,
                                                        }).save();

                                                        UserCartSchema.findOneAndRemove({ productId: product[i].productId })
                                                        .exec()
                                                        .then(response => console.log(response));
                                                    })
                                                    .catch(error => {
                                                        res.status(400).send(error);
                                                    })
                                            }
                                            else {
                                                res.status(400).send({
                                                    message: "Product not found!"
                                                })
                                            }
                                        })
                                        .catch(error => {
                                            res.status(400).send(error);
                                        })

                                        const mailOptions = {
                                            from: 'ahadbawani123@gmail.com',
                                            to: userResponse.email,
                                            subject: 'Order Confirmation',
                                            text: `Dear customer,
                                            Thank you for your order. Your order ID is ${process.env.START_ORDER}
                                            your order will be delivered on ${date} between 7pm to 9pm
        
                                            Thank you for shopping with us
                                            
                                            
                                            Best regards,
                                            Zetomart`
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                console.log(error);
                                            }
                                            else {
                                                console.log("Email sended successfully")    
                                            }
                                        })

                                    res.status(200).send({
                                        orderId: parseInt(process.env.START_ORDER),
                                        message: "Order placed successfully!"
                                    })
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else {
                    res.status(400).send({
                        message: "User not found!"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        res.status(400).send(error);
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
