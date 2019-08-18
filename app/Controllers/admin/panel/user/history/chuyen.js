
var UserInfo  = require('../../../../../Models/UserInfo');
var ChuyenRed = require('../../../../../Models/ChuyenRed');

module.exports = function(client, data){
	if (!!data.id && data.page) {
		var page = data.page>>0;
		if (data.page > 0) {
			UserInfo.findOne({'id': data.id}, 'name', function(err, user){
				if (!!user) {
					var kmess = 10;
					var regex = new RegExp("^" + user.name + "$", 'i');
					ChuyenRed.countDocuments({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}).exec(function(err, total){
						ChuyenRed.find({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
							client.red({users:{chuyen:{data:result, page:page, kmess:kmess, total:total}}});
						});
					});
				}
			});
		}
	}
}
