
const Admin    = require('./Admin')
const Users    = require('./panel/Users')
const NapThe   = require('./panel/NapThe')
const MuaThe   = require('./panel/MuaThe')
const Shop     = require('./panel/Shop')
const GiftCode = require('./panel/GiftCode')

const TaiXiu       = require('./game/taixiu')
const BauCua       = require('./game/baucua')
const MiniPoker    = require('./game/mini_poker')
const BigBabol     = require('./game/big_babol')
const VuongQuocRed = require('./game/vq_red')
const mini3cay     = require('./game/mini3cay')
const angrybirds   = require('./game/angrybirds')


module.exports = function(client, data) {
	if (client.auth && client.UID) {
		if (void 0 !== data.admin) {
			Admin.onData(client, data.admin)
		}

		// Begin Game
		if (void 0 !== data.taixiu) {
			TaiXiu(client, data.taixiu)
		}
		if (void 0 !== data.baucua) {
			BauCua(client, data.baucua)
		}
		if (void 0 !== data.mini_poker) {
			MiniPoker(client, data.mini_poker)
		}
		if (void 0 !== data.big_babol) {
			BigBabol(client, data.big_babol)
		}
		if (void 0 !== data.vq_red) {
			VuongQuocRed(client, data.vq_red)
		}
		if (void 0 !== data.mini3cay) {
			mini3cay(client, data.mini3cay)
		}
		if (void 0 !== data.angrybird) {
			angrybirds(client, data.angrybird)
		}
		// End Game

		if (void 0 !== data.nap_the) {
			NapThe.onData(client, data.nap_the)
		}
		if (void 0 !== data.mua_the) {
			MuaThe.onData(client, data.mua_the)
		}
		if (void 0 !== data.users) {
			Users(client, data.users)
		}
		if (void 0 !== data.shop) {
			Shop.onData(client, data.shop)
		}
		if (void 0 !== data.giftcode){
			GiftCode.onData(client, data.giftcode);
		}
	}
}
