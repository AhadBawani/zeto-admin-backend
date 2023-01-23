const User = require('../Schemas/UserSchema');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const UserEmailVerification = require('../Schemas/UserEmailVerification');
const UserSchema = require('../Schemas/UserSchema');
const utils = require('../Utils/utils');

module.exports.GET_ALL_USER = (async (req, res) => {
    try {
        await User.find()
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response)
                }
            })
            .catch();
    }
    catch (err) {
        res.send("error : ", err);
    }
})


module.exports.GET_USER_BY_ID = (async (req, res) => {
    try {
        await User.findById(req.params.id).select('_id username phoneNumber email password type')
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response);
                }
                else {
                    res.status(404).send({
                        message: "User Not Found!"
                    })
                }
            })
            .catch();
    }
    catch (err) {
        res.send("Error : ", err)
    }
})

module.exports.LOGIN_USER = (async (req, res) => {
    let { phoneNumber, password } = req.body;
    try {
        User.findOne({ phoneNumber: phoneNumber, password: password })
            .exec()
            .then(response => {
                if (response) {
                    if (response?.verified) {
                        res.status(200).json({
                            _id: response._id,
                            username: response.username,
                            email: response.email,
                            phoneNumber: response.phoneNumber,
                            password: response.password,
                            type: response.type
                        })
                    }
                    else {
                        res.status(200).send({
                            message: "User is not verified!"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "User not Found!"
                    })
                }
            })
            .catch();
    }
    catch (err) {
        res.send("Error : ", err);
    }
})

module.exports.SIGNUP_USER = (async (req, res) => {
    // let hash = await bcrypt.hash(password, 10);    
    const { username, phoneNumber, email, password, type } = req.body;
    const OTP = parseInt(crypto.randomBytes(3).toString('hex'), 16).toString().slice(0, 4);
    await User.findOne({ phoneNumber: phoneNumber })
        .exec()
        .then(async response => {
            if (!response) {
                const user = new User({
                    username: username,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password,
                    type: type
                }).save();
                // email
                user
                    .then(response => {
                        if (response) {
                            utils.sendEmail(email, OTP)
                                .then(emailResponse => {
                                    if (emailResponse) {
                                        res.status(200).send({
                                            message: "Email Sended Successfully!",
                                            user : response
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            else if (!response.verified) {
                try {
                    UserEmailVerification.findOneAndRemove({ email: email }, (err, response) => {
                        if (!response) {
                            //email
                            utils.sendEmail(email, OTP)
                                .then(emailResponse => {
                                    if (emailResponse) {
                                        res.status(200).send({
                                            message: "Email Sended Successfully!"
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                        else {
                            //email
                            utils.sendEmail(email, OTP)
                                .then(emailResponse => {
                                    if (emailResponse) {
                                        res.status(200).send({
                                            message: "Email Sended Successfully!"
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    })
                }
                catch (err) {
                    res.send(err)
                }
            }
            else {
                res.status(404).send({
                    message: "User already exist!"
                })
            }
        })
        .catch(error => {
            console.log(error)
        });
})

module.exports.VERIFY_OTP = (async (req, res) => {
    const { email, otp } = req.body;
    try {
        await UserEmailVerification.findOne({ email: email })
            .exec()
            .then(async response => {
                if (response.otp === parseInt(otp)) {
                    await UserSchema.findOneAndUpdate({ email: email }, { verified: true }, { new: true }, (error, response) => {
                        if (error) {
                            console.log(error);
                        }
                        if (response) {
                            res.status(200).send({
                                message: "User email Verified!"
                            })
                        }
                    })
                }
                else {
                    res.status(200).send({
                        message: "OTP not match!"
                    })
                }
            })
            .catch();
    }
    catch (error) {
        console.log(error)
    }
})


module.exports.EDIT_USER_NUMBER = (async (req, res) => {
    try {
        User.findByIdAndUpdate(req.params.userId, { phoneNumber: req.body.phoneNumber },
            { new: true },
            (err, response) => {
                if (response) {
                    res.status(200).send({
                        message: "Edited Successfully!"
                    })
                }
            })
    }
    catch (err) {
        res.send("error : ", err);
    }
})
