
let UserInfo = require('./app/Models/UserInfo');
let Telegram = require('./app/Models/Telegram');

module.exports = function(){
	UserInfo.updateMany({}, {'$set':{'veryphone':false, 'veryold':false}}).exec();
	Telegram.deleteMany({}).exec();
}
