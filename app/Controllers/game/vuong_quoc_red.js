
const spin  = require('./vuong_quoc_red/spin');
const bonus = require('./vuong_quoc_red/bonus');
const log   = require('./vuong_quoc_red/log');
const top   = require('./vuong_quoc_red/top');

module.exports = function(client, data){
	if (void 0 !== data.info) {
		//info(client, data.info)
	}
	if (void 0 !== data.bonus) {
		bonus(client, data.bonus)
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
