const express = require('express');
const router = express.Router();
const AdminController = require('../Controller/AdminController');
const Orders = require('../../Schemas/OrderSchema');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./Images");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', AdminController.GET_ALL_ORDERS);
router.post('/OrderDelivered/:orderId', (async (req, res) => {
    Orders.find({ orderId: req.params.orderId })
    .exec()
    .then(response => {
        if(response){
            Orders.updateMany({ orderId: req.params.orderId }, { orderDelivered:true })
            .exec()
            .then(result => {
                if(result){
                    res.status(200).send({
                        message : "Updated Successfully"
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
        else{
            res.status(404).send({
                message : "Order not found!"
            })
        }
    })
    .catch(error => {
        console.log(error)
    })
}))
router.post('/', upload.single('productImage'),AdminController.ADD_PRODUCT);
router.patch('/DisabledProduct/:productId/:result', AdminController.EDIT_DISABLED_PRODUCT);
router.delete('/:productId', AdminController.DELETE_PRODUCT);
router.put('/EditProduct/:productId', AdminController.EDIT_PRODUCT);


module.exports = router;