
const spin = require('./big_babol/spin');
const log  = require('./big_babol/log');
const top  = require('./big_babol/top');



module.exports = function(client, data){
	if (void 0 !== data.info) {
		//info(client, data.info)
	}
	if (void 0 !== data.spin) {
		spin(client, data.spin)
	}
	if (void 0 !== data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
