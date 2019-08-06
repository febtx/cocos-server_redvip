
const spin = require('./angrybird/spin');
const log  = require('./angrybird/log');
const top  = require('./angrybird/top');

module.exports = function(client, data){
	if (void 0 !== data.info) {
		//info(client, data.info)
	}
	if (void 0 !== data.spin) {
		spin(client, data.spin);
	}
	if (void 0 !== data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
