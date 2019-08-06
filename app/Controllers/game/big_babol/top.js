
const BigBabol_red = require('../../../Models/BigBabol/BigBabol_red');
const BigBabol_xu  = require('../../../Models/BigBabol/BigBabol_xu');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		BigBabol_red.find({$or:[
			{type:1},
			{type:2}
		]}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{big_babol:{top:arrayOfResults}}});
			})
		});
	}else{
		BigBabol_xu.find({$or:[
			{type:1},
			{type:2}
		]}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{big_babol:{top:arrayOfResults}}});
			})
		});
	}
};
