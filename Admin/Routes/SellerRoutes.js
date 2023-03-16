const express = require('express');
const router = express.Router();
const SellerController = require('../Controller/SellerController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./SellerImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', SellerController.GET_ALL_SELLER);
router.post('/', upload.fields([{ name: 'sellerImage', maxCount: 1 }, { name: 'sellerCoverImage', maxCount: 1 }]), SellerController.ADD_SELLER);
router.patch('/:sellerId/:result', SellerController.DISABLED_SELLER);
router.put('/:sellerId', upload.fields([{ name: 'sellerImage', maxCount: 1 }, { name: 'sellerCoverImage', maxCount: 1 }]), SellerController.EDIT_SELLER);
module.exports = router;
