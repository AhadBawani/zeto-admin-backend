const Product = require('../Schemas/ProductSchema');


module.exports.GET_ALL_PRODUCTS = (async (req, res) => {
    try {
        await Product.find()
            .select('_id productName productImage sellerName price category description mrp discount disabled mainCategory')
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response);
                }
            })
            .catch(err => {
                console.log(err);
            });

    }
    catch (err) {
        res.send("error : ", err);
    }
})

module.exports.GET_SELLER_PRODUCTS = (async (req, res) => {
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