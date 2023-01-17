const User = require('../Schemas/UserSchema');
const bcrypt = require('bcrypt');

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
                        type:response.type
                    })
                }
                else {
                    res.status(404).send({
                        message: "User not Found!"
                    })
                }
            })
            .catch();
        // User.findOne({ phoneNumber: phoneNumber })
        //     .exec()
        //     .then(async response => {
        //         if (response) {
        //             let result = await bcrypt.compare(password, response?.password);
        //             if (result) {
        //                 res.status(200).json({
        //                     _id: response._id,
        //                     username: response.username,
        //                     email: response.email,
        //                     phoneNumber: response.phoneNumber,
        //                     password: response.password
        //                 })
        //             }
        //             else{
        //                 res.status(404).send({
        //                     message : "Incorrect Password!"
        //                 })
        //             }
        //         }
        //         else {
        //             res.status(404).send({
        //                 message: "User not Found!"
        //             })
        //         }
        //     })
        //     .catch();        
    }
    catch (err) {
        res.send("Error : ", err);
    }
})

module.exports.SIGNUP_USER = (async (req, res) => {
    let { username, phoneNumber, email, password, type } = req.body;
    // let hash = await bcrypt.hash(password, 10);    
    await User.findOne({ phoneNumber : phoneNumber})
    .exec()
    .then(async response => {        
        if(!response){
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
        else{
            res.status(404).send({
                message : "User already exist!"
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