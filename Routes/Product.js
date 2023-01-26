const express = require('express');
const ProductController = require('../Controller/ProductController');
const ProductSchema = require('../Schemas/ProductSchema');
const router = express.Router();


router.get('/', ProductController.GET_ALL_PRODUCTS);
router.get('/getsellerproduct', (req, res) => {
    ProductSchema.aggregate([
        {
            $lookup:{
                from: 'SellerSchema',
                localField:'sellerID',
                foreignField: '_id',
                as : 'seller'
            }
        },
        {
            $group:{
                _id:'$sellerID',
                count:{ $sum: 1 }          
            }
        }
    ])
    .exec()
    .then(response => {
        res.json(response);
    })
    .catch(error => {
        console.log(error)
    })
})

module.exports = router;