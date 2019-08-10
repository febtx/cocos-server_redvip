
var VuongQuocRed_red = require('../../../Models/VuongQuocRed/VuongQuocRed_red');
var VuongQuocRed_xu  = require('../../../Models/VuongQuocRed/VuongQuocRed_xu');

module.exports = function(client, data){
	if (!!data && !!data.page) {
		var page = data.page>>0; // trang
		var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
		if (page < 1) {
			client.red({notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "THẤT BẠI"}});
		}else{
			var kmess = 10;
			var regex = new RegExp("^" + client.profile.name + "$", 'i');
			if (red) {
				VuongQuocRed_red.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					VuongQuocRed_red.find({name: {$regex: regex}}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({VuongQuocRed:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}else{
				VuongQuocRed_xu.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					VuongQuocRed_xu.find({name: {$regex: regex}}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({VuongQuocRed:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}
		}
	}
};
