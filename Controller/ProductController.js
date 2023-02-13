const Product = require('../Schemas/ProductSchema');
const UserSchema = require('../Schemas/UserSchema');
const SellerSchema = require('../Admin/Schemas/SellerSchema');

module.exports.GET_ALL_PRODUCTS = (async (req, res) => {
    try {
        await Product.find()
            .select('_id productName productImage sellerID price categoryId description mrp discount disabled subCategoryId')
            .populate('categoryId', 'category')
            .populate('subCategoryId', 'subCategory')
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

module.exports.EDIT_PRODUCT_SELLER = (async (req, res) => {
    const { userId, productId, sellerId } = req.body;
    try{
        await UserSchema.findOne({ _id: userId, type:"Admin" })
        .exec()
        .then(response => {
            if(response){
                Product.findById(productId)
                .exec()
                .then(response => {
                    if(response){
                        SellerSchema.findById(sellerId)
                        .exec()
                        .then(response => {
                            if(response){
                                Product.findOneAndUpdate({ _id:productId }, { sellerID: sellerId })
                                .exec()
                                .then(response => {
                                    if(response){
                                        res.status(200).send({
                                            message : "Updated Successfully!"
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            }
                            else{
                                res.status(404).send({
                                    message : "Seller Not Found!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }
                    else{
                        res.status(404).send({
                            message : "Product Not Found!"
                        })
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
            else{
                res.status(403).send({
                    message : "Permission Denied!"
                })
            }
        })
        .catch(error => {
            console.log(error);
        })
    }
    catch(error){
        console.log(error);
    }
})