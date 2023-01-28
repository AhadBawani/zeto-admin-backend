const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const shortid = require('shortid');
require('dotenv/config');

const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_PASSWORD
})

router.post('/', async (req, res) => {        
    let amount = parseInt(req.body.amount);
    const payment_capture = 1;

    const option = {
        amount:amount * 100,
        currency:'INR',        
        receipt:shortid.generate(),
        payment_capture    
    }

    try{
        const response = await razorpay.orders.create(option)
        res.json({
            id:response.id,
            currency:response.currency,
            amount:response.amount
        })                
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;