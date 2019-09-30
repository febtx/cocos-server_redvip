
let first  = require('./Controllers/User.js').first;
let onPost = require('./Controllers/onPost.js');

let auth = function(client) {
	client.gameEvent = {};
	client.scene = 'home';
	first(client);
}

let signMethod = function(client) {
	client.TTClear = function(){
		if (!!this.caothap && !!this.caothap.time) {
			clearTimeout(this.caothap.time);
		}
		//if (!!this.poker) {
		//	this.poker.outGame();
			//this.poker = null;
		//}
	}
}

module.exports = {
	auth:       auth,
	message:    onPost,
	signMethod: signMethod,
};
