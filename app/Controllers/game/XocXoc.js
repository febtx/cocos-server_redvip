
let ingame  = require('./XocXoc/ingame');
let outgame = require('./XocXoc/outgame');
let cuoc    = require('./XocXoc/cuoc');

module.exports = function(client, data){
	if (!!data.ingame) {
		ingame(client);
	}
	if (!!data.outgame) {
		outgame(client);
	}
	if (!!data.cuoc) {
		cuoc(client, data.cuoc);
	}
	client = null;
	data   = null;
};
