
// Mini Poker
const mini_poker = require('./game/mini_poker');

// Big Babol
const big_babol  = require('./game/big_babol');

// Vương Quốc Red
const vq_red     = require('./game/vuong_quoc_red');

// Bầu Cua
const baucua     = require('./game/baucua');

// Mini 3 Cây
const mini3cay     = require('./game/mini3cay');

module.exports = function(client, data){
	if (void 0 !== data.mini_poker) {
		mini_poker(client, data.mini_poker);
	}
	if (void 0 !== data.big_babol) {
		big_babol(client, data.big_babol);
	}
	if (void 0 !== data.vq_red) {
		vq_red(client, data.vq_red);
	}
	if (void 0 !== data.baucua) {
		baucua(client, data.baucua);
	}
	if (void 0 !== data.mini3cay) {
		mini3cay(client, data.mini3cay);
	}
}
