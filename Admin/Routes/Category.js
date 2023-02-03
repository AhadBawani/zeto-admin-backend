const express = require('express');
const router = express.Router();
const CategorySchema = require('../../Schemas/CategorySchema');
const UserSchema = require('../../Schemas/UserSchema');

router.get('/', (async (req, res) => {
    try {
        await CategorySchema.find()
            .select('_id category date')
            .exec()
            .then(response => {
                if (response) {
                    res.status(200).json(response);
                }
                else {
                    res.status(400).send({
                        message: "No Category available!"
                    })
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
    const { userId, category } = req.body;
    try {
        await UserSchema.findOne({ _id: userId, type: "Admin" })
            .exec()
            .then(response => {
                if (response) {
                    const Category = new CategorySchema({
                        category: category
                    }).save();
                    Category
                        .then(response => {
                            if (response) {
                                res.status(200).send({
                                    message: "Category Added Successfully!",
                                    category: {
                                        _id: response._id,
                                        category: response.category
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                else {
                    res.status(400).send({
                        message: "Permission Deined!"
                    })
                }
            })
            .catch(error => {
                res.status(400).send(error);
            })
    }
    catch (error) {
        console.log(error);
    }
}))

// router.delete('/:userId/:categoryId', (async (req, res) => {
//     const userId = req.params.userId;
//     const categoryId = req.params.categoryId;    
//     try{
//         await UserSchema.findById(userId)
//         .exec()
//         .then(response => {
//             if(response){
//                 CategorySchema.findByIdAndDelete(categoryId)
//                 .exec()
//                 .then(response => {
//                     if(response){
//                         res.status(200).send({
//                             message : "Category Deleted Successfully!"
//                         })
//                     }
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 })
//             }
//             else{
//                 res.status(400).send({
//                     message : "Permission deined!"
//                 })
//             }
//         })
//         .catch(error => {
//             console.log(error);
//         })
//     }
//     catch(error){
//         console.log(error);
//     }
// }))

module.exports = router;