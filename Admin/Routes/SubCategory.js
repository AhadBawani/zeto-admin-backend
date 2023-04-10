const express = require('express');
const CategorySchema = require('../../Schemas/CategorySchema');
const SubCategorySchema = require('../../Schemas/SubCategorySchema');
const router = express.Router();
const SubCategoryUtils = require('../Controller/SubCategoryController');
const SellerSchema = require('../Schemas/SellerSchema');
const utils = require('../AdminUtils/Common/CommonUtils');

router.get('/', SubCategoryUtils.GET_SUB_CATEGORY);

router.post('/', SubCategoryUtils.ADD_SUB_CATEGORY);

router.put('/:subCategoryId', SubCategoryUtils.EDIT_SUBCATEGORY);

module.exports = router;