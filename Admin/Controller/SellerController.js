const SellerReviewSchema = require('../../Schemas/SellerReviewSchema');
const SellerSchema = require('../Schemas/SellerSchema');
const ProductSchema = require('../../Schemas/ProductSchema');
const Seller = require('../Schemas/SellerSchema');

module.exports.GET_ALL_SELLER = (async (req, res) => {
    try {
        let seller = await Seller.find().select('_id sellerName sellerImage date category');
        res.status(200).json(seller);
    }
    catch (err) {
        console.log(err)
    }
})

module.exports.ADD_SELLER = (async (req, res) => {
    const { sellerName, date, category, disabled } = req.body;
    try {
        const seller = new Seller({
            sellerName: sellerName,
            sellerImage: req.file.filename,
            date: date,
            category: category,
            disabled: disabled
        }).save();

        seller
            .then(response => {
                if (response) {
                    res.status(201).json({
                        message: "Seller Created Successfully!",
                        seller: {
                            _id: response._id,
                            sellerName: response.sellerName,
                            sellerImage: response.sellerImage,
                            date: response.date,
                            category: response.category,
                            disabled: response.disabled
                        }
                    })
                }
            })
            .catch(error => {
                res.status(400).send(error);
            });
    }
    catch (err) {
        res.send(err)
    }
})

module.exports.DELETE_SELLER = (async (req, res) => {
    const sellerId = req.params.sellerId;
    try {
        await SellerSchema.findByIdAndDelete(sellerId)
            .exec()
            .then(response => {
                if (response) {
                    console.log(response);
                    res.send('console');
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports.DISABLED_SELLER = (async (req, res) => {
    const { sellerId, result } = req.params;

    try {
        await SellerSchema.findByIdAndUpdate(sellerId, { disabled: result }, { new: true })
            .exec()
            .then(async response => {
                if (response) {
                    await ProductSchema.updateMany({ sellerID: sellerId }, { disabled: result })
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
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
})