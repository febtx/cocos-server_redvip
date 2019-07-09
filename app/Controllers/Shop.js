
const nap_the    = require('./shop/nap_the');
const mua_the    = require('./shop/mua_the');
const mua_xu     = require('./shop/mua_xu.js');
const chuyen_red = require('./shop/chuyen_red');
const get_daily  = require('./shop/get_daily');

const info_thanhtoan   = require('./shop/info_thanhtoan');

module.exports = function(client, data){
	if (client.auth && client.UID) {
		if (void 0 !== data.nap_the) {
			nap_the(client, data.nap_the);
		}
		if (void 0 !== data.mua_the) {
			mua_the(client, data.mua_the);
		}
		if (void 0 !== data.mua_xu) {
			mua_xu(client, data.mua_xu);
		}
		if (void 0 !== data.chuyen_red) {
			chuyen_red(client, data.chuyen_red);
		}
		if (void 0 !== data.get_daily) {
			get_daily(client);
		}
		if (void 0 !== data.info_nap) {
			info_thanhtoan(client, 1);
		}
		if (void 0 !== data.info_mua) {
			info_thanhtoan(client);
		}
	}
}
