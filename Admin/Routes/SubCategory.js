const express = require('express');
const router = express.Router();
const SubCategoryUtils = require('../Controller/SubCategoryController');

router.get('/', SubCategoryUtils.GET_SUB_CATEGORY);

router.post('/', SubCategoryUtils.ADD_SUB_CATEGORY);

module.exports = router;