const Product = require('../Schemas/ProductSchema');


module.exports.GET_ALL_PRODUCTS = (async (req, res) => {
    try {
        await Product.find()
            .select('_id productName productImage sellerName price category description mrp discount disabled')
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

