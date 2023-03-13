const express = require('express');
const app = express();
const user = require('./Routes/User');
const product = require('./Routes/Product');
const userCart = require('./Routes/UserCart');
const Orders = require('./Routes/Orders');
const Payment = require('./Routes/Payment');
const seller = require('./Admin/Routes/SellerRoutes');
const adminRoutes = require('./Admin/Routes/AdminRoutes');
const DeliveryRate = require('./Admin/Routes/DeliveryRateRoutes');
const SellerReview = require('./Routes/SellerReview');
const OrderReview = require('./Routes/OrderReview');
const Category = require('./Admin/Routes/Category');
const SubCategory = require('./Admin/Routes/SubCategory');
const Contact = require('./Routes/Contact');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const scheduler = require('./Utils/scheduler');
const path = require('path');
require('dotenv/config');

process.env.TZ = 'IST';
var dir = path.join(__dirname, "Images");
app.use(express.static(dir));
app.use(cors());
app.use('/Images', express.static('Images'));
app.use('/SellerImages', express.static('SellerImages'));
app.use(bodyParser.json());

scheduler.start();
app.use('/User', user);
app.use('/Product', product);
app.use('/UserCart', userCart);
app.use('/Orders', Orders);
app.use('/Payment', Payment);
app.use('/Admin', adminRoutes);
app.use('/Seller', seller);
app.use('/Deliveryrate', DeliveryRate);
app.use('/SellerReview', SellerReview);
app.use('/OrderReview', OrderReview);
app.use('/Category', Category);
app.use('/SubCategory', SubCategory);
app.use('/Contact', Contact);

app.get('/', (req, res) => {
    res.send("We are at home......");
})

app.use((req, res) => {
    res.send({
        message : "Invalid URL"
    })
})

mongoose.connect(process.env.DB_CONNECTION, 
        { useNewUrlParser : true }, 
        () => console.log("CONNECTED TO DB"));

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
});