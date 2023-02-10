const UserSchema = require('../../../Schemas/UserSchema');

module.exports.VERIFY_USER = userId => {
    return new Promise(async (resolve, reject) => {
        await UserSchema.findOne({ _id:userId, type:"Admin" })
        .exec()
        .then(response => {
            if(response){
                resolve(response);
            }
            else{
                reject(response);
            }
        })
        .catch(error => {
            reject(response);
        })
    })
}