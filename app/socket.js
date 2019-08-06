
const User      = require('./Controllers/User.js')
const onPost    = require('./Controllers/onPost.js')

function auth(client) {
	client.gameEvent = {};
	client.scene = "home";
	User.first(client);
}

function signMethod(client) {
	client.TTClear = function(){
		void 0 !== this.caothap && clearTimeout(this.caothap.time);
	}
}

module.exports = {
	auth:       auth,
	message:    onPost,
	signMethod: signMethod,
};
