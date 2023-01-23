const nodemailer = require('nodemailer');
const UserEmailVerification = require('../Schemas/UserEmailVerification');

module.exports.sendEmail = (email, OTP) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ahadbawani123@gmail.com',
                pass: 'aqjtbkzuwrhrrrkk'
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
                const user = new UserEmailVerification({
                    otp: OTP,
                    email: email,
                }).save();
                resolve(user);
            }
        });
    })
}