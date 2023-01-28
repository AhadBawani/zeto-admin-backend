const UserSchema = require('../../Schemas/UserSchema');
const DeliveryRate = require('../Schemas/DelieveryRate');

module.exports.GET_CURRENT_RATE = (async (req, res) => {
    try {
        await DeliveryRate.findOne().sort({ _id: -1 })
            .exec()
            .then(response => {
                if(response){
                    res.status(200).send({
                        rate : response.rate
                    })
                }
                else{
                    res.status(200).send({
                        rate : 18
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    catch (error) {

    }
})

module.exports.CHANGE_DELIVERY_RATE = (async (req, res) => {
    const { userId, rate } = req.body;
    try {
        await UserSchema.findById(userId)
            .then(response => {
                if (response.type === "Admin") {
                    const deliveryRate = new DeliveryRate({
                        userId: userId,
                        rate: rate
                    }).save();

                    deliveryRate
                        .then(response => {
                            if(response){
                                res.status(200).send({
                                    message : "Delivery rate updated successfully!"
                                })
                            }
                        })
                        .catch(error => {
                            res.status(400).send(error);
                        });
                }
                else {
                    res.status(404).send({
                        message: "Sorry only admin can do!"
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


module.exports.GET_ALL_CHANGES = (async (req, res) => {
    try{
        const deliveryRate = await DeliveryRate
                    .find()
                    .populate('userId', 'username email phoneNumber password type')
                    .select('_id userId rate date');
        res.status(200).json(deliveryRate);
    }
    catch(error){
        console.log(error);
    }
})