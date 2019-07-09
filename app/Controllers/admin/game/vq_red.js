
const get_data = require('./vq_red/get_data')
const name_hu  = require('./vq_red/name_hu')

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
}
