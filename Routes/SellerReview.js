const express = require('express');
const router = express.Router();
const SellerReviewController = require('../Controller/SellerReviewController');

router.get('/', SellerReviewController.GET_ALL_REVIEW);

router.delete('/:userId/:reviewId', SellerReviewController.DELETE_REVIEW);

module.exports = router;