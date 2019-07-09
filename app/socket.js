const User      = require('./Controllers/User.js')
const onPost    = require('./Controllers/onPost.js')

function auth(client) {
	client.gameEvent = {};
	client.scene = "home";
	User.first(client, 'name exp phone red xu ketSat lastDate regDate');
}

module.exports = {
	auth: auth,
	message: onPost,
};
