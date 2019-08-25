
var first  = require('./Controllers/User.js').first;
var onPost = require('./Controllers/onPost.js');

function auth(client) {
	client.gameEvent = {};
	client.scene = "home";
	first(client);
}

function signMethod(client) {
	client.TTClear = function(){
		if (!!this.caothap && !!this.caothap.time) {
			clearTimeout(this.caothap.time);
		}
		if (!!this.poker) {
			this.poker.outGame();
			//this.poker = null;
		}
	}
}

module.exports = {
	auth:       auth,
	message:    onPost,
	signMethod: signMethod,
};
