
const spin = require('./mini3cay/spin');
const logs = require('./mini3cay/logs');
const tops = require('./mini3cay/tops');

module.exports = function(client, data){
	if (void 0 !== data.spin) {
		spin(client, data.spin)
	}
	if (void 0 !== data.logs) {
		logs(client, data.logs)
	}
	if (void 0 !== data.tops) {
		tops(client, data.tops)
	}
};
