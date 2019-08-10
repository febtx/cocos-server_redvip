
var BauCua_user = require('../../../Models/BauCua/BauCua_user');

var UserInfo   = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red  = !!data;   // Loại tiền (Red: true, Xu: false)
	var query = 'uid ' + (red ? 'red' : 'xu');
	var sort = red ? {'red':-1} : {'xu':-1};
	var find = red ? {red:{$gt:0}} : {xu:{$gt:0}};
	BauCua_user.find(find, query, {sort: sort, limit: 50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			var getPhien = UserInfo.findOne({id: obj.uid}, 'name').exec();
			return Promise.all([getPhien]).then(values => {
				Object.assign(obj, values[0]._doc);
				delete obj.__v;
				delete obj._id;
				delete obj.uid;
				return obj;
			});
		}))
		.then(function(arrayOfResults) {
			client.red({mini:{baucua:{tops:arrayOfResults}}});
		})
	});
};
