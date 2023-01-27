const express = require('express');
const router = express.Router();
const OrderReview = require('../Schemas/OrderReviewSchema');
const OrderSchema = require('../Schemas/OrderSchema');
const UserSchema = require('../Schemas/UserSchema');

router.post('/', (async (req, res) => {
    const { orderId, userId, review, rating } = req.body;
    try {
        await OrderSchema.findOne({ orderId: orderId })
            .exec()
            .then(async response => {
                if (response) {
                    if (response.userId === userId) {
                        let orderReview = new OrderReview({
                            orderId: orderId,
                            userId: userId,
                            review: review,
                            rating: rating
                        });
                        await orderReview.save();
                        res.status(201).send({
                            message: "Review Submitted Successfully!"
                        })
                    } else {
                        res.status(404).send({
                            message: "Invalid User Review!"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "Order not found!"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error)
    }
}))

router.get('/', (async (req, res) => {
    try {
        let orderReview = await OrderReview
            .find()
            .populate('userId', '_id username email phoneNumber')
            .select('_id orderId userId review rating date');
        res.status(200).json(orderReview);
    }
    catch (error) {
        console.log(error)
    }
}))

router.get('/:userId', (async (req, res) => {
    const userId = req.params.userId;
    try {
        await UserSchema.findById(userId)
            .exec()
            .then(async response => {
                if (response) {
                    await OrderReview.find({ userId: userId })
                        .select('_id orderId userId review rating date')
                        .populate('userId', '_id username phoneNumber email')
                        .exec()
                        .then(response => {
                            if(response.length == 0){
                                res.status(200).send({
                                    message : "User have no review!"
                                })
                            }
                            else{
                                res.status(200).json(response);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else {
                    res.status(404).send({
                        message: "User not found!"
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
}))

module.exports = router;