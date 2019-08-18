
module.exports = function(client) {
	var configTX = require('../../../../../config/taixiu.json');
	var configBC = require('../../../../../config/baucua.json');
	client.red({sys:{txbot: configTX.bot, bcbot: configBC.bot}});
}
