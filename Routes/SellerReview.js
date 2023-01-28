const express = require('express');
const router = express.Router();
const SellerReviewSchema = require('../Schemas/SellerReviewSchema');
const UserSchema = require('../Schemas/UserSchema');
const SellerReviewController = require('../Controller/SellerReviewController');

router.get('/Seller/:sellerId', SellerReviewController.GET_SELLER_REVIEW);

router.post('/', SellerReviewController.ADD_SELLER_REVIEW);

router.get('/', SellerReviewController.GET_ALL_REVIEW);

module.exports = router;