
// Mini Poker
const mini_poker = require('./game/mini_poker');

// Big Babol
const big_babol  = require('./game/big_babol');

// Vương Quốc Red
const vq_red     = require('./game/vuong_quoc_red');

// Bầu Cua
const baucua     = require('./game/baucua');

// Mini 3 Cây
const mini3cay   = require('./game/mini3cay');

// Mini 3 Cây
const caothap    = require('./game/caothap');

// AngryBirds
const angrybird  = require('./game/angrybird');

module.exports = function(client, data){
	if (!!data) {
		if (!!data.mini_poker) {
			mini_poker(client, data.mini_poker);
		}
		if (!!data.big_babol) {
			big_babol(client, data.big_babol);
		}
		if (!!data.vq_red) {
			vq_red(client, data.vq_red);
		}
		if (!!data.baucua) {
			baucua(client, data.baucua);
		}
		if (!!data.mini3cay) {
			mini3cay(client, data.mini3cay);
		}
		if (!!data.caothap) {
			caothap(client, data.caothap);
		}
		if (!!data.angrybird) {
			angrybird(client, data.angrybird);
		}
	}
}
