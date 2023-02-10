const express = require('express');
const router = express.Router();
const SellerReviewController = require('../Controller/SellerReviewController');

router.get('/', SellerReviewController.GET_ALL_REVIEW);

module.exports = router;