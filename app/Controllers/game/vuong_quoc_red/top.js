
const VuongQuocRed_red = require('../../../Models/VuongQuocRed/VuongQuocRed_red');
const VuongQuocRed_xu  = require('../../../Models/VuongQuocRed/VuongQuocRed_xu');

const UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		VuongQuocRed_red.find({$or:[
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
				client.send(JSON.stringify({VuongQuocRed:{top:arrayOfResults}}));
			})
		});
	}else{
		VuongQuocRed_xu.find({$or:[
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
				client.send(JSON.stringify({VuongQuocRed:{top:arrayOfResults}}));
			})
		});
	}
};