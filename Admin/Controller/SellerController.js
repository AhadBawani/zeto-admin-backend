const SellerReviewSchema = require('../../Schemas/SellerReviewSchema');
const SellerSchema = require('../Schemas/SellerSchema');
const Seller = require('../Schemas/SellerSchema');

module.exports.GET_ALL_SELLER = (async (req, res) => {
    try {
        let seller = await Seller.find().select('_id sellerName sellerImage date category');
        res.status(200).json(seller);        
        // SellerSchema.aggregate([
        //     {
        //         $lookup: {
        //             from: 'sellerreviews',
        //             localField: '_id',
        //             foreignField: 'sellerId',
        //             as: 'reviews'
        //         }
        //     }
        // ]).then(result => {
        //     console.log(result);
        //     res.send('console');
        // result will have an array of sellers with reviews
        // }).catch(error => {
        //     console.log(error);
        // });
    }
    catch (err) {
        console.log(err)
    }
})

module.exports.ADD_SELLER = (async (req, res) => {
    const { sellerName, date, category } = req.body;
    try {
        const seller = new Seller({
            sellerName: sellerName,
            sellerImage: req.file.filename,
            date: date,
            category:category
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
                            category:response.category
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