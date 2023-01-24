const Orders = require('../../Schemas/OrderSchema');
const Product = require('../../Schemas/ProductSchema');

module.exports.GET_ALL_ORDERS = (async (req, res) => {
    try {
        await Orders.find()
            .populate('productId')
            .populate('userId')
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    catch (err) {
        res.send("error : ", err);
    }
})

module.exports.EDIT_PRODUCT = (async (req, res) => {
    try {
        await Product.findById(req.params.productId)
            .exec()
            .then(async response => {
                if (response) {
                    let update = {
                        productName: req.body.productName,
                        category: req.body.category,
                        price: req.body.price,
                        sellerName: req.body.sellerName,
                        discount: req.body.discount,
                        mrp: req.body.mrp,
                        description: req.body.description
                    }
                    await Product.findByIdAndUpdate(req.params.productId, update)
                        .exec()
                        .then(result => {
                            if (result) {
                                res.status(200).send({
                                    message: "Product Edited Successfully!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
                else {
                    res.status(404).send({
                        message: "Product Not Found!"
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    catch (error) {
        console.log(error)
    }
})


module.exports.ADD_PRODUCT = ((req, res) => {
    try {
        const product = new Product({
            productName: req.body.productName,
            productImage: req.file.filename,
            price: req.body.price,
            sellerName: req.body.sellerName,
            category: req.body.category,
            description: req.body.description,
            mrp: req.body.mrp,
            discount: req.body.discount,
            disabled: req.body.disabled
        })

        product.save();
        res.status(201).json({
            message: "Product Created Successfully!",
            product: {
                _id: product._id,
                productName: product.productName,
                productImage: product.productImage,
                price: product.price,
                sellerName: product.sellerName,
                category: product.category,
                description: product.description,
                mrp: product.mrp,
                discount: product.discount,
                disabled: product.disabled
            }
        })
    }
    catch (err) {
        res.send(err)
    }
})

module.exports.EDIT_DISABLED_PRODUCT = (async (req, res) => {
    try {        
        Product.findById(req.params.productId)
            .exec()
            .then(response => {
                if (response) {
                    Product.findByIdAndUpdate(req.params.productId,
                        { disabled: req.params.result },
                        { new: true },
                        (err, result) => {
                            if (result) {
                                res.status(200).send({
                                    message: `Product ${result?.disabled ? "disabled" : "enabled"} successfully!`
                                })         
                            }
                        })
                }
                else {
                    res.status(404).send({
                        message: "Product Not Found!"
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }
    catch (err) {
        console.log("error : ", err);
    }
})

module.exports.DELETE_USER = (async (req, res) => {
    try{
        await UserSchema.findByIdAndRemove(req.params.id)
        .exec()
        .then(response => {
            if(response){
                res.status(200).send({
                    message : "User Deleted Successfully!"
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
    catch(err){
        console.log(err)
    }
})


module.exports.DELETE_PRODUCT = (async (req, res) => {
    try {
        Product.remove({ _id: req.params.productId })
            .exec()
            .then(response => {
                if (response?.deletedCount > 0) {
                    res.status(200).send({
                        message: "Product deleted successfully"
                    })
                    UserCart.remove({ productId: req.params.productId });
                }
                else {
                    res.status(404).send({
                        message: "Product Not Found!"
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    catch (err) {
        res.send("Error : ", err);
    }
})
