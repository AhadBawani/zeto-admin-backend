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
router.patch('/:sellerId/:result', SellerController.DISABLED_SELLER);
router.put('/:sellerId', upload.single('sellerImage'), SellerController.EDIT_SELLER);
module.exports = router;
