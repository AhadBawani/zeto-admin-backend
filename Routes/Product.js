const express = require('express');
const ProductController = require('../Controller/ProductController');
const router = express.Router();


router.get('/', ProductController.GET_ALL_PRODUCTS);
router.get('/getsellerproduct', ProductController.GET_SELLER_PRODUCTS);
router.put('/EditProductSeller', ProductController.EDIT_PRODUCT_SELLER);
module.exports = router;