
let lo2     = require('./mb/lo2so');
let history = require('./mb/history');

module.exports = function(client, data){
	console.log(data);
	if (!!data.history) {
		history(client, data.history);
	}
	if (!!data.lo2) {
		lo2(client, data.lo2);
	}
	client = null;
	data   = null;
};
