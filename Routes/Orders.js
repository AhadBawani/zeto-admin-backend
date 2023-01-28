const express = require('express');
const router = express.Router();
const OrdersController = require('../Controller/OrdersController');


router.get('/:userId', OrdersController.GET_USER_ORDER);

router.delete('/:orderId', OrdersController.DELETE_ORDER);

router.post('/', OrdersController.PLACE_ORDER);

router.patch('/Delivered/:orderId', OrdersController.ORDER_DELIVERED);

module.exports = router;