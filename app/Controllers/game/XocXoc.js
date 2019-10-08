
let ingame  = require('./XocXoc/ingame');
let outgame = require('./XocXoc/outgame');

module.exports = function(client, data){
	if (!!data.ingame) {
		ingame(client);
	}
	if (!!data.outgame) {
		outgame(client);
	}
	client = null;
	data = null;
};
