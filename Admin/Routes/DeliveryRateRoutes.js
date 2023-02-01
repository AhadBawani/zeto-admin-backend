const express = require('express');
const router = express.Router();
const DelieveryRateController = require('../Controller/DeliverRateController');

router.get('/', DelieveryRateController.GET_CURRENT_RATE);

router.post('/', DelieveryRateController.CHANGE_DELIVERY_RATE);

router.get('/Allchanges', DelieveryRateController.GET_ALL_CHANGES);

module.exports = router;