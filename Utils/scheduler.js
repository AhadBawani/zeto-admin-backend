const cron = require('node-cron');
const UserEmailVerification = require('../Schemas/UserEmailVerification');

module.exports = {
    start: () => {
        cron.schedule("0 * * * *", () => {
            const expiredTime = new Date(Date.now() - (60 * 60 * 1000));
            UserEmailVerification.deleteMany({ generatedAt: { $lt: expiredTime } })
            .exec()
            .then(response => {
                if(response.deletedCount > 0){
                    console.log(`count : ${response.deletedCount}`);
                }
            })
            .catch(error => {
                console.log(error);
            });
        });
    }
};
