const express = require('express');
const ContactSchema = require('../Schemas/ContactSchema');
const router = express.Router();

router.get('/', (async (req, res) => {
    try {
        await ContactSchema.find()
            .select('_id username email phoneNumber interest description')
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response);
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
}))


router.post('/', (async (req, res) => {
    const { username, phoneNumber, interest, email, description } = req.body;
    try {
        const contact = new ContactSchema({
            username: username,
            phoneNumber: phoneNumber,
            interest: interest,
            email: email,
            description: description
        }).save();

        contact
            .then(response => {
                if(response){
                    res.status(200).send({
                        message : "Contact Added Successfully!"
                    })
                }
            })
            .catch(error => {
                res.status(400).send(error);
            });
    }
    catch (error) {
        console.log(error);
    }
}))
module.exports = router;