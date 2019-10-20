
let spin    = require('./megaj/spin');
let nhan    = require('./megaj/nhan');
let top     = require('./megaj/top');
let history = require('./megaj/history');
let update  = require('./megaj/update');

module.exports = function(client, data){
	if (!!data.spin) {
		spin(client, data.spin);
	}
	if (!!data.nhan) {
		nhan(client, data.nhan);
	}
	if (!!data.history) {
		history(client, data.history);
	}
	if (void 0 !== data.top) {
		top(client, data.top);
	}
	if (!!data.update) {
		update(client);
	}
};
