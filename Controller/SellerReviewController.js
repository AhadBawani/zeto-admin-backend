const SellerReviewSchema = require('../Schemas/SellerReviewSchema');

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