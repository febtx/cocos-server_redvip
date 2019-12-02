
let BauCua_user = require('../../../Models/BauCua/BauCua_user');
let UserInfo   = require('../../../Models/UserInfo');
module.exports = function(client){
	let project = {uid:'$uid',profit:{$subtract:['$red', '$red_lost']}};
	BauCua_user.aggregate([
		{$project: project},
		{$match:{'profit':{$gt:0}}},
		{$sort: {'profit': -1}},
		{$limit: 100}
	]).exec(function(err, result){
		Promise.all(result.map(function(obj){
			return new Promise(function(resolve, reject) {
				UserInfo.findOne({'id':obj.uid}, 'name', function(error, result2){
					resolve({name:result2.name, bet:obj.profit});
				})
			})
		}))
		.then(function(data){
			client.red({mini:{baucua:{tops:data}}});
		})
	});
};
