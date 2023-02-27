const express = require('express');
const router = express.Router();
const OrdersController = require('../Controller/OrdersController');
const OrderSchema = require('../Schemas/OrderSchema');


router.get('/:userId', OrdersController.GET_USER_ORDER);

router.delete('/:orderId', OrdersController.DELETE_ORDER);

router.post('/', OrdersController.PLACE_ORDER);

router.patch('/Delivered/:orderId', OrdersController.ORDER_DELIVERED);

router.get('/Generatepdf/:orderId/:userId', OrdersController.GENERATE_ORDER_PDF);

module.exports = router;