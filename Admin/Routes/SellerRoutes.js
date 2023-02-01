const Seller = require('../Schemas/SellerSchema');
const express = require('express');
const router = express.Router();
const SellerController = require('../Controller/SellerController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./SellerImages");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', SellerController.GET_ALL_SELLER);
router.post('/', upload.single('sellerImage'), SellerController.ADD_SELLER);
router.delete('/:sellerId', SellerController.DELETE_SELLER);
router.patch('/:sellerId/:result', SellerController.DISABLED_SELLER);
module.exports = router;
