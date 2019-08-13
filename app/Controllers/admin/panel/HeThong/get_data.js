
module.exports = function(client) {
	var config = require('../../../../../config/taixiu.json');
	client.red({sys:{txBot: config.bot}});
}
