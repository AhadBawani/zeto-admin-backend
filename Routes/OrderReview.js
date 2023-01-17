const express = require('express');
const router = express.Router();
const OrderReview = require('../Schemas/OrderReviewSchema');

router.post('/', (async (req, res) => {
    try{
        let orderReview = new OrderReview({
            orderId:req.body.orderId,
            userId:req.body.userId,
            review:req.body.review,
            rating:req.body.rating,
            date:req.body.date,
            time:req.body.time
        });
        await orderReview.save();
        res.status(201).send({
            message: "Review Submitted Successfully!"
        })
    }
    catch(error){
        console.log(error)
    }
}))

router.get('/', (async (req, res) => {
    try{
        let orderReview = await OrderReview.find();
        res.status(200).json(orderReview);
    }
    catch(error){
        console.log(error)
    }
}))