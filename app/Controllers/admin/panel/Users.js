
const get_users  = require('./user/get_users');
const get_info   = require('./user/get_info');
const updateUser = require('./user/updateUser');

module.exports = function (client, data) {
	if (void 0 !== data.get_info) {
		get_info(client, data.get_info)
	}
	if (void 0 !== data.get_users) {
		get_users(client, data.get_users);
	}
	if (void 0 !== data.update) {
		updateUser(client, data.update)
	}
}
