
const get_data = require('./mini3cay/get_data')
const name_hu  = require('./mini3cay/name_hu')

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
}
