const express = require('express');
const router = express.Router();
const OrdersController = require('../Controller/OrdersController');
const OrderSchema = require('../Schemas/OrderSchema');
const PDFDocument = require('pdfkit');

router.get('/:userId', OrdersController.GET_USER_ORDER);

router.delete('/:orderId', OrdersController.DELETE_ORDER);

router.post('/', OrdersController.PLACE_ORDER);

router.patch('/Delivered/:orderId', OrdersController.ORDER_DELIVERED);

router.get('/Generatepdf/:orderId/:userId', (async (req, res) => {
    const { userId, orderId } = req.params;

    try {
        await OrderSchema.find({ orderId: orderId })
            .select('_id orderId userId productId quantity date block paymentType orderDelivered orderReview')
            .populate('productId', '_id productName productImage price mrp discount subCategoryId categoryId description')
            .populate('userId', '_id username email phoneNumber type')
            .exec()
            .then(response => {
                console.log(response[0]?.userId?._id);
                if (response.length > 0) {
                    if (response[0]?.userId?._id == userId) {
                        const doc = new PDFDocument();
                        // Set the response header
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename="bill.pdf"');

                        // Stream the PDF to the response
                        doc.pipe(res);

                        // Add content to the PDF
                        doc.fontSize(25).text('Invoice', { underline: true });

                        // Add order details
                        doc.fontSize(15).text(`Order ID: ${response[0]?.orderId}`)
                        doc.fontSize(15).text(`Username: ${response[0]?.userId?.username}`);
                        // doc.fontSize(12).text(`Order Number: ${order.number}`);
                        doc.fontSize(12).text(`Order Date: ${response[0]?.date}`);
                        doc.fontSize(12).text(`Shipping Address: Marwadi University`);
                        doc.fontSize(12).text(`Billing Address: Marwadi University`);

                        // Add a table for the order items
                        // let itemsTable = [];
                        var total = 0;
                        // itemsTable.push(['Product Name', 'Quantity', 'Price']);
                        // response.forEach(item => {
                        //     itemsTable.push([item?.productId?.productName, item.quantity, item?.productId?.price]);
                        // });
                        doc.fontSize(12).text('Product Name').moveDown().text('Quantity').moveDown().text('Price').moveDown();
                        response.forEach(item => {
                            doc.text(item?.productId?.productName).moveDown().text(item.quantity).moveDown().text(item?.productId?.price).moveDown();
                            total += (item?.quantity * item?.productId?.price);
                        });
                        // doc.table(itemsTable, {
                        //     prepareHeader: () => doc.font('Helvetica-Bold'),
                        //     prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                        // });

                        // Add the total
                        doc.fontSize(15).text(`Total: ${total}`);

                        // End the PDF
                        doc.end();
                    }
                    else {
                        res.status(400).send({
                            message: "Invalid User for order!"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "No order found!"
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
}));

module.exports = router;