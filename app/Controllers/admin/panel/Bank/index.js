
var add    = require('./add');
var remove = require('./remove');
var list   = require('./list');

module.exports = function (client, data) {
	if (!!data.list) {
		list(client);
	}
	if (!!data.add) {
		add(client, data.add)
	}
	if (!!data.remove) {
		remove(client, data.remove)
	}
}
