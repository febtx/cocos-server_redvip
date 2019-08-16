
var getTop   = require('./getTop');
var getTopHQ = require('./getTopHQ');

module.exports = function(client, data){
	if (!!data.getTop) {
		getTop(client);
	}

	if (!!data.getTopHQ) {
		getTopHQ(client);
	}
};
