const SellerReviewSchema = require('../Schemas/SellerReviewSchema');
const UserSchema = require('../Schemas/UserSchema');

module.exports.GET_SELLER_REVIEW = (async (req, res) => {
    try {
        await SellerReviewSchema.find({ sellerId: req.params.sellerId })
            .select('_id sellerId userId rating review')
            .populate('userId', 'username email phoneNumber')
            .exec()
            .then(response => {
                if (response) {
                    let total = 0;
                    response.map((item) => {
                        total += item?.rating;
                    })

                    const average = Math.round(total / response.length);
                    res.status(200).send({
                        average: average,
                        reviews: response
                    });
                }
                else {
                    res.status(200).send({
                        message: "Currently seller have no review"
                    })
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

module.exports.GET_ALL_REVIEW = (async (req, res) => {
    try {
        const SellerReview = await SellerReviewSchema
            .find()
            .populate('userId', '_id username phoneNumber email')
            .populate('sellerId', '_id sellerImage sellerName date')
            .select('_id sellerId userId rating review');
        res.status(200).json(SellerReview);
    }
    catch (error) {
        console.log(error);
    }
})