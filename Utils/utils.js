const nodemailer = require('nodemailer');
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
            text: `Your OTP is: ${OTP}`
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