
var first  = require('./Controllers/User.js').first;
var onPost = require('./Controllers/onPost.js');

function auth(client) {
	client.gameEvent = {};
	client.scene = "home";
	first(client);
}

function signMethod(client) {
	client.TTClear = function(){
		!!this.caothap && !!this.caothap.time && clearTimeout(this.caothap.time);
	}
}

module.exports = {
	auth:       auth,
	message:    onPost,
	signMethod: signMethod,
};
