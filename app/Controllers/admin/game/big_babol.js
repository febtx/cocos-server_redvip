
const get_data = require('./big_babol/get_data');
const get_top  = require('./big_babol/get_top');
const name_hu  = require('./big_babol/name_hu');

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top)
	}
}