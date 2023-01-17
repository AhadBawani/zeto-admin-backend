const express = require('express');
const ProductController = require('../Controller/ProductController');
const router = express.Router();



router.get('/', ProductController.GET_ALL_PRODUCTS);
// router.post('/', upload.single('productImage'),ProductController.ADD_PRODUCT);
// router.patch('/:productId', ProductController.EDIT_DISABLED_PRODUCT);
// router.delete('/:productId', ProductController.DELETE_PRODUCT);


module.exports = router;