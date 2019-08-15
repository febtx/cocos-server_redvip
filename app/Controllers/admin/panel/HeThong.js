
var get_data = require('./HeThong/get_data');
var TXBot    = require('./HeThong/TXBot');
var clear    = require('./HeThong/clear');

module.exports = function(client, data) {
	if (!!data) {
		if (void 0 !== data.txbot) {
			TXBot(client, data.txbot);
		}
		if (!!data.get_data){
			get_data(client);
		}
		if (!!data.clear){
			clear(client, data.clear);
		}
		if (!!data.event){
			var config = require('../../../Cron/EventHu');
			config();
		}
	}
}
