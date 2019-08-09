
const AngryBirds_red = require('../../../Models/AngryBirds/AngryBirds_red');
const AngryBirds_xu  = require('../../../Models/AngryBirds/AngryBirds_xu');

module.exports = function(client, data){
	var page = data.page>>0; // trang
	var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
	if (page < 1) {
		client.red({notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "THẤT BẠI"}});
	}else{
		var kmess = 8;
		var regex = new RegExp("^" + client.profile.name + "$", 'i');
		if (red) {
			AngryBirds_red.countDocuments({name: {$regex: regex}}).exec(function(err, total){
				AngryBirds_red.find({name: {$regex: regex}}, 'id win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({mini:{arb:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
					})
				});
			})
		}else{
			AngryBirds_xu.countDocuments({name: {$regex: regex}}).exec(function(err, total){
				AngryBirds_xu.find({name: {$regex: regex}}, 'id win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({mini:{arb:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
					})
				});
			})
		}
	}
};