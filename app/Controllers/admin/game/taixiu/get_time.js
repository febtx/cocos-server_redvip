
const TXPhien = require('../../../../Models/TaiXiu_phien');

module.exports = function(client, data) {
	TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
		if (last !== null){
			client.red({taixiu:{phien: last.id+1, time_remain: client.redT.TaiXiu_time}});
		}
	})
}
