
//:{get_config

let get_config = require('./eventvip/get_config');
let update     = require('./eventvip/update');
let trathuong  = require('./eventvip/trathuong');
let reset      = require('./eventvip/reset');

module.exports = function (client, data) {
	if (void 0 !== data.get_config) {
		get_config(client)
	}
	if (!!data.update) {
		update(client, data.update)
	}
	if (!!data.trathuong) {
		trathuong(client);
	}
	if (!!data.reset) {
		reset(client);
	}
}
