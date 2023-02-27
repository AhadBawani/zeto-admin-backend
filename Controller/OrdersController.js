const DelieveryRate = require('../Admin/Schemas/DelieveryRate');
const Order = require('../Schemas/OrderSchema');
const ProductSchema = require('../Schemas/ProductSchema');
const nodemailer = require('nodemailer');
const UserCartSchema = require('../Schemas/UserCartSchema');
const User = require('../Schemas/UserSchema');
const PDFDocument = require('pdfkit');
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
    if ((currentHour > process.env.LAST_ORDER_TIME) | (currentHour == process.env.LAST_ORDER_TIME && today.getMinutes() > 1)) {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        date = tomorrow.getDate() + "/" + ((tomorrow.getMonth() + 1) > 10 ? tomorrow.getMonth() + 1 : "0" + (tomorrow.getMonth() + 1)) + "/" + tomorrow.getFullYear();
    }
    else {
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

                                                        // UserCartSchema.findOneAndRemove({ productId: product[i].productId })
                                                        // .exec()
                                                        // .then(response => console.log(response));
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

                                                        // UserCartSchema.findOneAndRemove({ productId: product[i].productId })
                                                        // .exec()
                                                        // .then(response => console.log(response));
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

                    UserCartSchema.deleteMany({ userId: userId })
                        .exec()
                        .then(response => console.log(response));
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

module.exports.GENERATE_ORDER_PDF = (async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        const order = await Order.find({ orderId: orderId, userId: userId })
            .populate('userId')
            .populate('productId');

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="order.pdf"');
        doc.pipe(res);

        doc.fontSize(25).text('Order Details', { underline: true });
        doc.moveDown();

        doc.fontSize(16).text(`Order ID: ${order[0].orderId}`);
        doc.fontSize(16).text(`User: ${order[0].userId?.username}`);
        doc.fontSize(16).text(`Order Date: ${order[0].date}`);
        doc.moveDown();

        const items = order.map((item) => [item.productId?.productName, item.productId?.price, item.quantity, item.total]);
        const headers = ['Product', 'Price', 'Quantity', 'Total'];
        const columnWidths = {
            0: 250,
            1: 100,
            2: 100,
            3: 100,
        };
        let y = doc.y;
        let x = doc.x;
        for (let i = 0; i < headers.length; i++) {
            doc
                .font('Helvetica')
                .fontSize(14)
                .text(headers[i], x, y, {
                    width: columnWidths[i],
                    align: 'right',
                    lineBreak: false,
                });
            x += columnWidths[i];
        }

        for (const row of items) {
            for (let i = 0; i < row.length; i++) {
                doc
                    .font('Helvetica')
                    .fontSize(14)
                    .text(row[i], {
                        width: columnWidths[i],
                        align: 'left',
                        lineBreak: false,
                    });
                x += columnWidths[i];
            }
            y += doc.currentLineHeight() + 5;
        }
        doc.fontSize(16).text(`${order[0].total}`);
        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
    // await OrderSchema.find({ orderId: orderId, userId: userId })
    //     .select('_id orderId userId productId quantity date block paymentType orderDelivered orderReview')
    //     .populate('productId', '_id productName productImage price mrp discount subCategoryId categoryId description')
    //     .populate('userId', '_id username email phoneNumber type')
    //     .exec()
    //     .then(response => {
    //         if (response.length > 0) {
    //             const doc = new PDFDocument();
    //             // Set the response header
    //             res.setHeader('Content-Type', 'application/pdf');
    //             res.setHeader('Content-Disposition', 'attachment; filename="bill.pdf"');

    //             // Stream the PDF to the response
    //             doc.pipe(res);

    //             // Add content to the PDF
    //             doc.fontSize(25).text('Invoice', { underline: true });

    //             // Add order details
    //             doc.fontSize(15).text(`Order ID: ${response[0]?.orderId}`)
    //             doc.fontSize(15).text(`Username: ${response[0]?.userId?.username}`);
    //             // doc.fontSize(12).text(`Order Number: ${order.number}`);
    //             doc.fontSize(12).text(`Order Date: ${response[0]?.date}`);
    //             doc.fontSize(12).text(`Shipping Address: Marwadi University`);
    //             doc.fontSize(12).text(`Billing Address: Marwadi University`);

    //             // Add a table for the order items
    //             // let itemsTable = [];
    //             var total = 0;
    //             // itemsTable.push(['Product Name', 'Quantity', 'Price']);
    //             // response.forEach(item => {
    //             //     itemsTable.push([item?.productId?.productName, item.quantity, item?.productId?.price]);
    //             // });
    //             doc.fontSize(12).text('Product Name').moveDown().text('Quantity').moveDown().text('Price').moveDown();
    //             response.forEach(item => {
    //                 doc.text(item?.productId?.productName).moveDown().text(item.quantity).moveDown().text(item?.productId?.price).moveDown();
    //                 total += (item?.quantity * item?.productId?.price);
    //             });
    //             // doc.table(itemsTable, {
    //             //     prepareHeader: () => doc.font('Helvetica-Bold'),
    //             //     prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
    //             // });

    //             // Add the total
    //             doc.fontSize(15).text(`Total: ${total}`);

    //             // End the PDF
    //             doc.end();
    //         }
    //         else {
    //             res.status(404).send({
    //                 message: "No order found!"
    //             })
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });    

})