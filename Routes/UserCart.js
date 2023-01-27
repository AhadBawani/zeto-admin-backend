const express = require('express');
const router = express.Router();
const UserCartController = require('../Controller/UserCartController');


router.get('/:userId', UserCartController.GET_USER_CART);
router.post('/', UserCartController.ADD_USER_CART);
router.patch('/AddQuantity/:cartId', UserCartController.ADD_CART_QUANTITY);
router.patch('/RemoveQuantity/:cartId', UserCartController.REMOVE_CART_QUANTITY);
router.delete('/:cartId', UserCartController.REMOVE_USER_CART);

module.exports = router;