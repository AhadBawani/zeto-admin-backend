const express = require('express');
const ProductController = require('../Controller/ProductController');
const ProductSchema = require('../Schemas/ProductSchema');
const router = express.Router();


router.get('/', ProductController.GET_ALL_PRODUCTS);
router.get('/getsellerproduct', (req, res) => {
    try {
        ProductSchema.aggregate([
            {
                $group: {
                    _id: "$sellerID",                    
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "sellers",
                    localField: "sellerID",
                    foreignField: "_id",
                    as: "seller"
                }
            }
        ])
            .exec()
            .then(response => {
                console.log(response);
                res.send('console');
            })
            .catch();

    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;