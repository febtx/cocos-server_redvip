
var Admin    = require('./Admin')
var Users    = require('./panel/Users')
var NapThe   = require('./panel/NapThe')
var MuaThe   = require('./panel/MuaThe')
var Shop     = require('./panel/Shop')
var GiftCode = require('./panel/GiftCode')

var TaiXiu       = require('./game/taixiu')
var BauCua       = require('./game/baucua')
var MiniPoker    = require('./game/mini_poker')
var BigBabol     = require('./game/big_babol')
var VuongQuocRed = require('./game/vq_red')
var mini3cay     = require('./game/mini3cay')
var angrybirds   = require('./game/angrybirds')

module.exports = function(client, data) {
	if (!!data) {
		if (!!data.admin) {
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
