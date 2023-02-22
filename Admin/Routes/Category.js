const express = require('express');
const router = express.Router();
const CategoryController = require('../Controller/CategoryController');


router.get('/', CategoryController.GET_ALL_CATEGORY);

router.post('/', CategoryController.ADD_CATEGORY);

router.put('/:categoryId', CategoryController.EDIT_CATEGORY);

module.exports = router;