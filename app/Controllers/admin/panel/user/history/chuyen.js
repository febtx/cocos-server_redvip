
var UserInfo  = require('../../../../../Models/UserInfo');
var ChuyenRed = require('../../../../../Models/ChuyenRed');

module.exports = function(client, data){
	if (!!data.id && data.page) {
		var page = data.page>>0;
		if (data.page > 0) {
			var kmess = 10;
			ChuyenRed.countDocuments({uid:data.id}).exec(function(err, total){
				ChuyenRed.find({uid:data.id}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({users:{chuyen:{data:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}
