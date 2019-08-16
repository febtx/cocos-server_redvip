
var TaiXiu_User = require('../../../Models/TaiXiu_user');
var UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client){
	var topWin = TaiXiu_User.aggregate([
		{$match:{tLineWinHQ:{$gt:0}}},
		{$project: {
			uid: "$uid",
			top: "$tLineWinHQ",
			gift: "$tLineWinHQGift",
		}},
		{$sort: {'tLineWinHQ': -1, 'tLineWinHQGift': -1}},
		{$limit: 20}
	]).exec();

	var topLost = TaiXiu_User.aggregate([
		{$match:{tLineLostHQ:{$gt:1}}},
		{$project: {
			uid: "$uid",
			top: "$tLineLostHQ",
			gift: "$tLineLostHQGift",
		}},
		{$sort: {'tLineLostHQ': -1, 'tLineLostHQGift': -1}},
		{$limit: 20}
	]).exec();

	Promise.all([topWin, topLost])
	.then(result => {
		var win = new Promise(function(resolveH, rejectTH) {
			Promise.all(result[0].map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, 'name', function(error, user){
							delete obj._id;
							delete obj.uid;
							if (!!user) {
								obj['name'] = user.name;
							}
							resolve(obj);
						})
					})
			}))
			.then(usersWin => {
				resolveH(usersWin);
			})
		});

		var lost = new Promise(function(resolveTH, rejectTH) {
			Promise.all(result[1].map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, 'name', function(error, user){
							delete obj._id;
							delete obj.uid;
							if (!!user) {
								obj['name'] = user.name;
							}
							resolve(obj);
						})
					})
			}))
			.then(usersLost => {
				resolveTH(usersLost);
			})
		});
		Promise.all([win, lost])
		.then(resultH => {
			win = resultH[0]
			client.red({event:{taixiu:{topHQ:{win: resultH[0], lost: resultH[1]}}}});
		});
	});
};
