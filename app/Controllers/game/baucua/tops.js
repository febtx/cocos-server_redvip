
var BauCua_user = require('../../../Models/BauCua/BauCua_user');

var UserInfo   = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red  = !!data;   // Loại tiền (Red: true, Xu: false)

	var project = {
		uid: "$uid",
	}

	if (red) {
		project.profit =  {$subtract: ["$red", "$red_lost"]};
	}else{
		project.profit =  {$subtract: ["$xu", "$xu_lost"]};
	}

	BauCua_user.aggregate([
		{
			$project: project,
		},
		{$sort: {'profit': -1}},
		{$limit: 100}
	]).exec(function(err, result){
		if (result.length) {
			Promise.all(result.map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, 'name', function(error, result2){
						resolve({name: result2.name, bet: obj.profit});
					})
				})
			}))
			.then(function(data){
				Promise.all(data.filter(function(obj){
					return obj.profit > 0;
				}))
				.then(function(result3){
					client.red({mini:{baucua:{tops:result3}}});
				});
			})
		}
	});
};
