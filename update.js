
let UserInfo = require('./app/Models//UserInfo');
let Phone    = require('./app/Models//Phone');
var Telegram = require('./app/Models/Telegram');

module.exports = function(){
	Phone.find({}, {}, function(err, dataP){
		dataP.forEach(function(phoneT){
			UserInfo.findOne({id:phoneT.uid}, '_id', function(err2, user){
				if (!user) {
					Telegram.deleteOne({'phone':phoneT.phone}).exec();
					Phone.deleteOne({'_id': phoneT._id}).exec();
				}
			});
		});
	});
}
