
const BigBabol_red = require('../../../Models/BigBabol/BigBabol_red');
const BigBabol_xu  = require('../../../Models/BigBabol/BigBabol_xu');

module.exports = function(client, data){
	var page = data.page>>0; // trang
	var hu   = !!data.hu;                     // Danh sách chúng hũ hoặc thắng lớn
	var red  = !!data.red;                    // Loại tiền (Red: true, Xu: false)
	if (page < 1) {
		client.send(JSON.stringify({notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "THẤT BẠI"}}));
	}else{
		var kmess = 8;
		var objSearch = {type: 6};
		//var objSearch = hu ? {type: 6} : {type: {$in: [4, 5]}};
		if (red) {
			BigBabol_red.countDocuments(objSearch).exec(function(err, total){
				BigBabol_red.find(objSearch, 'name win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.send(JSON.stringify({mini:{big_babol:{top:{data:resultArr, page:page, kmess:kmess, total:total>60 ? 60 : total}}}}));
					})
				});
			})
		}else{
			BigBabol_xu.countDocuments(objSearch).exec(function(err, total){
				BigBabol_xu.find(objSearch, 'name win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.send(JSON.stringify({mini:{big_babol:{top:{data:resultArr, page:page, kmess:kmess, total:total>60 ? 60 : total}}}}));
					})
				});
			})
		}
	}
};
