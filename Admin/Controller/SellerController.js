const Seller = require('../Schemas/SellerSchema');

module.exports.GET_ALL_SELLER = (async (req, res) => {
    try{
        let seller = await Seller.find().select('_id sellerName sellerImage date');
        res.status(200).json(seller);
    }
    catch(err){
        console.log(err)
    }
})

module.exports.ADD_SELLER = (async (req, res) => {
    try {
        const seller = new Seller({
            sellerName: req.body.sellerName,
            sellerImage: req.file.filename,
            date:req.body.date
        })
        await seller.save();
        res.status(201).json({
            message: "Seller Created Successfully!",
            seller: {
                _id: seller._id,
                sellerName: seller.sellerName,
                sellerImage: seller.sellerImage,
                date:seller.date
            }
        })
    }
    catch (err) {
        res.send(err)
    }
})