const User = require('../Schemas/UserSchema');
const crypto = require('crypto');
const utils = require('../Utils/utils');
const UserEmailVerification = require('../Schemas/UserEmailVerification');
const UserSchema = require('../Schemas/UserSchema');

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
    let { username, phoneNumber, email, password, type } = req.body;
    // let hash = await bcrypt.hash(password, 10);    
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
                })
                try {
                    await user.save();
                    res.status(201).json({
                        message: "User created successfully!",
                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            phoneNumber: user.phoneNumber,
                            password: user.password
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

module.exports.FORGOT_PASSWORD = (async (req, res) => {
    const { email } = req.body;
    const OTP = parseInt(crypto.randomBytes(3).toString('hex'), 16).toString().slice(0, 4);
    try {
        UserSchema.findOne({ email: email })
            .exec()
            .then(async response => {
                if (response) {
                    await UserEmailVerification.findOne({ email: email })
                        .exec()
                        .then(async response => {
                            if (response) {
                                await UserEmailVerification.findOneAndUpdate({ email: email }, { otp: OTP })
                                    .exec()
                                    .then(response => {
                                        if (response) {
                                            utils.sendEmail(email, OTP)
                                                .then(response => {
                                                    if (response) {
                                                        res.status(200).send({
                                                            message: "OTP sended successfully!!"
                                                        })
                                                    }
                                                })
                                                .catch(error => {
                                                    if (error) {
                                                        console.log(error);
                                                    }
                                                });
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            }
                            else {
                                const userEmailVerfication = new UserEmailVerification({
                                    email: email,
                                    otp: OTP
                                }).save();

                                userEmailVerfication
                                    .then(response => {
                                        if (response) {
                                            utils.sendEmail(email, OTP)
                                                .then(response => {
                                                    if (response) {
                                                        res.status(200).send({
                                                            message: "OTP sended successfully!!"
                                                        })
                                                    }
                                                })
                                                .catch(error => {
                                                    if (error) {
                                                        console.log(error);
                                                    }
                                                });
                                        }
                                    })
                                    .catch();
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }
                else {
                    res.status(404).send({
                        message: "Account with this Email doesn't exit!"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (err) {
        console.log(err)
    }
})

module.exports.VERIFY_OTP = (async (req, res) => {
    const { email, otp } = req.body;
    try {
        await UserEmailVerification.findOne({ email: email })
            .exec()
            .then(response => {
                if (response) {
                    if (response?.otp === otp) {
                        res.status(200).send({
                            message: "OTP match successfully!!"
                        })
                    }
                    else {
                        res.status(404).send({
                            message: "OTP doesn't match"
                        })
                    }
                }
                else {
                    res.status(404).send({
                        message: "OTP doesn't exist"
                    })
                }
            })
            .catch();
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.CHANGE_PASSWORD = (async (req, res) => {
    const { email, password } = req.body;
    try {
        await UserSchema.findOne({ email: email })
            .exec()
            .then(async response => {
                if (response) {
                    await UserSchema.findOneAndUpdate({ email: email }, { password: password }, { new: true })
                        .exec()
                        .then(response => {
                            if (response) {
                                res.status(200).send({
                                    message: "Password updated successfully!"
                                })
                            }
                        })
                        .catch();
                }
                else {
                    res.status(404).send({
                        message: "User doesn't Exist"
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    catch (error) {
        console.log(error);
    }
})

module.exports.EDIT_USER = (async (req, res) => {
    const { username, email, phoneNumber } = req.body;
    try {
        await User.findById(req.params.userId)
            .exec()
            .then(async response => {
                if (response) {
                    await User.findByIdAndUpdate(req.params.userId, { username: username, email: email, phoneNumber: phoneNumber }, { new: true })
                        .exec()
                        .then(response => {
                            if (response) {
                                res.status(200).send({
                                    message: "User edited successfully!"
                                })
                            }
                            else {
                                res.status(500).send({
                                    message: "Something went wrong"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
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
    } catch (error) {

    }
})