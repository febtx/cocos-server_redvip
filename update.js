
let UserInfo    = require('./app/Models/UserInfo');
let MegaJP_user = require('./app/Models/MegaJP/MegaJP_user');

module.exports = function(){
	UserInfo.find({}, '_id', function(err, users){
		users.forEach(function(user){
			MegaJP_user.findOne({uid:user._id}, {}, function(err2, dataP){
				if (!dataP) {
					MegaJP_user.create({'uid':user._id});
				}
			});
		});
	});
}
