const UserSchema = require('../../Schemas/UserSchema');
const DeliveryRate = require('../Schemas/DelieveryRate');
const utils = require('../AdminUtils/Common/CommonUtils');

module.exports.GET_CURRENT_RATE = (async (req, res) => {
    try {
        await DeliveryRate.findOne().sort({ _id: -1 })
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).send({
                        rate: response.rate
                    })
                }
                else {
                    res.status(200).send({
                        rate: 18
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

module.exports.CHANGE_DELIVERY_RATE = (async (req, res) => {
    const { userId, rate } = req.body;
    try {
        utils.VERIFY_USER(userId)
            .then(response => {
                if (response) {
                    const deliveryRate = new DeliveryRate({
                        userId: userId,
                        rate: rate
                    }).save();

                    deliveryRate
                        .then(response => {
                            if (response) {
                                res.status(200).send({
                                    message: "Delivery rate updated successfully!"
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(400).send(error);
                        });
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (error) {
        console.log(error);
    }
})


module.exports.GET_ALL_CHANGES = (async (req, res) => {
    const { userId } = req.params;
    try {
        utils.VERIFY_USER(userId)
            .then(async response => {
                if (response) {
                    const deliveryRate = await DeliveryRate
                        .find()
                        .populate('userId', 'username email phoneNumber password type')
                        .select('_id userId rate date');
                    res.status(200).json(deliveryRate);
                }
            })
            .catch(error => {
                res.status(403).send({
                    message: "Permission Denied!"
                })
            })
    }
    catch (error) {
        console.log(error);
    }
})