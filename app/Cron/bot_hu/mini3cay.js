
var HU              = require('../../Models/HU');

var UserInfo        = require('../../Models/UserInfo');

var Helpers         = require('../../Helpers/Helpers');

function spin(io, user){
	
}

module.exports = function(io, listBot){
	var list = [...listBot];
	if (list.length) {
		var max = (list.length*10/100)>>0;
		list = Helpers.shuffle(list);
		list = Helpers.shuffle(list);
		list = list.slice(0, max);
		Promise.all(list.map(function(user){
			spin(io, user);
		}))
	}
};
