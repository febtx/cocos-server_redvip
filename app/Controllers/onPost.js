
const User     = require('./User')
const TaiXiu   = require('./TaiXiu')
const Shop     = require('./Shop')
const GiftCode = require('./GiftCode')
const Game     = require('./Game')

//const ControlAvatar  = require('./Avatar.js');

module.exports = function(client, p){
	if (client.auth && client.UID) {
		if (p.signName !== void 0)
			User.signName(client, p.signName);

		if (void 0 !== p.user)
			User.onData(client, p.user);

		if (void 0 !== p.taixiu)
			TaiXiu(client, p.taixiu);

		if (void 0 !== p.shop)
			Shop(client, p.shop);

		if (void 0 !== p.giftcode)
			GiftCode(client, p.giftcode);

		if (void 0 !== p.g)
			Game(client, p.g);

		if (void 0 !== p.scene && typeof p.scene === "string"){
			client.scene = p.scene;
			User.next_scene(client);
		}

		//if (p.avatar   !== void 0)
		//	ControlAvatar.upload(client, p.avatar);
	}
}
