
const get_data = require('./mini_poker/get_data')
const name_hu  = require('./mini_poker/name_hu')

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
}
