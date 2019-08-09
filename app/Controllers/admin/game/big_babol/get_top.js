
const BigBabol_users = require('../../../../Models/BigBabol/BigBabol_users');
const BigBabol_red   = require('../../../../Models/BigBabol/BigBabol_red');

const UserInfo       = require('../../../../Models/UserInfo');

module.exports = function(client, data) {
	var page = data.page>>0;
	var sort = data.sort>>0;
	var kmess = 9;
	if (page > 0) {

		// sort
		var sort = {};
		if (data.sort == '1') {
			sort.bet = -1;
		}else if (data.sort == '2') {
			sort.bet = 1;


		}else if (data.sort == '3') {
			sort.win = -1;
		}else if (data.sort == '4') {
			sort.win = 1;


		}else if (data.sort == '5') {
			sort.lost = -1;
		}else if (data.sort == '6') {
			sort.lost = 1;


		}else if (data.sort == '7') {
			sort.profit = -1;
		}else if (data.sort == '8') {
			sort.profit = 1;

		}else if (data.sort == '9') {
			sort._id = -1;
		}else if (data.sort == '10') {
			sort._id = 1;


		}else{
			sort.profit = -1;
		}

		// count total
		BigBabol_users.aggregate([
			{$count: 'total'},
		]).exec(function(err, countFind){
			BigBabol_users.aggregate([
				{$project: {
					profit: {$subtract: ["$win", "$lost"]},
					uid:    "$uid",
					bet:    "$bet",
					win:    "$win",
					lost:   "$lost",
				}},
				{$sort: sort},
				{$skip: (page-1)*kmess},
				{$limit: kmess}
			]).exec(function(err, result){
				if (result.length) {
					Promise.all(result.map(function(obj){
						return new Promise(function(resolve, reject) {
							UserInfo.findOne({'id': obj.uid}, 'name', function(error, user){
								delete obj._id;
								delete obj.uid;
								if (!!user) {
									obj['name'] = user.name;
									BigBabol_red.findOne({'name': user.name}, 'bet time', {sort:{'_id': -1}}, function(error, result2){
										if (!!result2) {
											obj['t'] = result2.time;
											obj['b'] = result2.bet;
										}
										resolve(obj);
									})
								}else{
									resolve(obj);
								}
							})
						})
					}))
					.then(function(data){
						client.red({big_babol:{get_top:{data:data, page:page, kmess:kmess, total:countFind[0].total}}});
					})
				}else{
					client.red({big_babol:{get_top:{data:[], page:1, kmess:9, total:0}}});
				}
			});
		});
	}
}