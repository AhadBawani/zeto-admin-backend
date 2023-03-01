const SellerReviewSchema = require('../Schemas/SellerReviewSchema');
const utils = require('../Admin/AdminUtils/Common/CommonUtils');
module.exports.GET_ALL_REVIEW = (async (req, res) => {
    try {
        const SellerReview = await SellerReviewSchema
            .find()
            .populate('userId', '_id username phoneNumber email')
            .populate('sellerId', '_id sellerImage sellerName date')
            .select('_id sellerId userId rating review deleteReview');
        res.status(200).json(SellerReview);
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.DELETE_REVIEW = (async (req, res) => {
    const { userId, reviewId } = req.params;
    try {
        utils.VERIFY_USER(userId)
            .then((response) => {
                if (response) {
                    SellerReviewSchema.findByIdAndUpdate(reviewId, { deleteReview:true }, { new : true })
                        .exec()
                        .then(response => {                            
                            if(response){
                                res.status(200).send({
                                    message : "Review Deleted successfully!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else{
                    res.status(400).send({
                        message : "Permission Denied!"
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
})