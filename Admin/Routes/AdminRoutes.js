const express = require('express');
const router = express.Router();
const AdminController = require('../Controller/AdminController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./Images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/:userId', AdminController.GET_ALL_ORDERS);
router.post('/OrderDelivered/:orderId', AdminController.DELIVERED_ORDER);
router.post('/', upload.single('productImage'), AdminController.ADD_PRODUCT);
router.patch('/DisabledProduct/:productId/:result/:adminUserId', AdminController.EDIT_DISABLED_PRODUCT);
router.delete('/deleteUser/:adminUserId/:userId', AdminController.DELETE_USER);
router.put('/EditProduct/:productId', upload.single('productImage'), AdminController.EDIT_PRODUCT);


module.exports = router;