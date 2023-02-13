const utils = require('../AdminUtils/Common/CommonUtils');

module.exports.GET_ALL_CATEGORY = (async (req, res) => {
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
})

module.exports.ADD_CATEGORY = (async (req, res) => {
    const { userId, category } = req.body;
    try {
        utils.VERIFY_USER(userId)
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

module.exports.EDIT_CATEGORY = (async (req, res) => {
    const { categoryId } = req.params;
    const { userId, category } = req.body;
    try {
        utils.VERIFY_USER(userId)
            .then(async response => {
                await CategorySchema.findById(categoryId)
                    .exec()
                    .then(response => {
                        if (response) {
                            CategorySchema.findByIdAndUpdate(categoryId, { category: category }, { new: true })
                                .exec()
                                .then(response => {
                                    if (response) {
                                        res.status(200).send({
                                            message: "Category Updated successfully!"
                                        })
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        }
                        else {
                            res.status(404).send({
                                message: "Category not found!"
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }
    catch (error) {
        console.log(error);
    }
})