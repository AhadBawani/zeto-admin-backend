const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    invoice:{
        type:String        
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    productId: {
        type: String,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    room: {
        type: Number,
        required: true
    },
    deliveryRate: {
        type: Number        
    },
    total: {
        type: Number        
    },
    paymentType: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
    },
    orderDelivered: {
        type: Boolean,
        default: false
    },
    orderReview: {
        type: Boolean,
        default: false
    },
    deleteOrder: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Order', OrderSchema);