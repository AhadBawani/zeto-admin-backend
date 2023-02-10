const nodemailer = require('nodemailer');
const UserCartSchema = require('../Schemas/UserCartSchema');
const UserEmailVerification = require('../Schemas/UserEmailVerification');
require('dotenv/config');

module.exports.sendEmail = (email, OTP) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: 'ahadbawani123@gmail.com',
            to: email,
            subject: 'Verify Account',
            text: `Your OTP is: ${OTP}. OTP will be expired after 1 hour.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    })
}


module.exports.ADD_TO_CART = (userId, productId, quantity, sellerId) => {
    return new Promise((resolve, reject) => {
        try {
            const userCart = new UserCartSchema({
                userId: userId,
                productId: productId,
                quantity: quantity,
                currentSellerId: sellerId
            }).save();

            userCart
                .then(response => {
                    if (response) {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        }
        catch (err) {
            reject(err);
        }
    })
}