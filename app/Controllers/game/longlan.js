
const spin  = require('./longlan/spin');
const bonus = require('./longlan/bonus');
const log   = require('./longlan/log');
const top   = require('./longlan/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus)
	}
	if (!!data.spin) {
		spin(client, data.spin)
	}
	if (!!data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
