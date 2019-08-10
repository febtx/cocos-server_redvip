
var tabDaiLy   = require('../../Models/DaiLy');
module.exports = function(client){
	tabDaiLy.find({}, function(err, daily){
		client.red({shop:{chuyen_red:{daily:daily}}});
	});
}
