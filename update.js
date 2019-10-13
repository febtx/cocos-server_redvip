
let UserInfo    = require('./app/Models//UserInfo');
let XocXoc_user = require('./app/Models/XocXoc/XocXoc_user');

module.exports = function(){
	UserInfo.find({}, {}, function(err, users){
		users.forEach(function(user){
			XocXoc_user.findOne({uid:user.id}, '_id', function(err2, data){
				if (!data) {
					XocXoc_user.create({'uid': user.id});
				}
			});
		});
	});
}
