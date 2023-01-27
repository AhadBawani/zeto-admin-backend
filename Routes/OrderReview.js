const express = require('express');
const router = express.Router();
const OrderReviewController = require('../Controller/OrderReviewController');


router.post('/', OrderReviewController.ADD_REVIEW);

router.get('/', OrderReviewController.GET_ALL_ORDER_REVIEW);

router.get('/:userId', OrderReviewController.GET_USER_ORDER_REVIEW);

module.exports = router;