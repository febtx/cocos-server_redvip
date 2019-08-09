
var User     = require('./User')
var TaiXiu   = require('./TaiXiu')
var Shop     = require('./Shop')
var GiftCode = require('./GiftCode')
var Game     = require('./Game')
var OTP      = require('./OTP')

//var ControlAvatar  = require('./Avatar.js');

module.exports = function(client, p){
	if (!!p) {
		if (!!p.signName){
			User.signName(client, p.signName);
		}

		if (!!p.user){
			User.onData(client, p.user);
		}

		if (!!p.taixiu){
			TaiXiu(client, p.taixiu);
		}

		if (!!p.shop){
			Shop(client, p.shop);
		}

		if (!!p.giftcode){
			GiftCode(client, p.giftcode);
		}

		if (!!p.g){
			Game(client, p.g);
		}

		if (!!p.scene && typeof p.scene === "string"){
			client.scene = p.scene;
			User.next_scene(client);
		}

		if (!!p.otp){
			OTP(client, p.otp);
		}

		//if (!!p.avatar)
		//	ControlAvatar.upload(client, p.avatar);

	}
}
