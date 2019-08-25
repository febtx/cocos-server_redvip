
var UserInfo  = require('./app/Models/UserInfo');
var CandyUser = require('./app/Models/Candy/Candy_user');

module.exports = function(){
	UserInfo.find({}, 'id', function(err, user){
		if (user.length) {
			Promise.all(user.map(function(obj){
				CandyUser.findOne({uid: obj.id}, 'uid', function(err2, user2){
					if (!user2) {
						CandyUser.create({'uid': obj.id});
					}
				});
			}))
		}
	});
}
