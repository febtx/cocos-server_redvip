
const tabDaiLy = require('../../Models/DaiLy');
module.exports = function(client){
	tabDaiLy.find({}, function(err, daily){
		client.send(JSON.stringify({shop:{chuyen_red:{daily:daily}}}));
	});
}
