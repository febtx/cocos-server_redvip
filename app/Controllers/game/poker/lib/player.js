
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, room, balans, red, auto){
	this.room     = null; // Phòng game

	this.isInGame = false;
	this.isPlay   = false;

	this.uid   = client.UID;
	this.name  = client.profile.name;

	this.client   = client;
	this.game     = room;   // game (100/1000/5000/10000/...)
	this.balans   = balans; // Tiền mang vào
	this.red      = red;    // Loại tiền (red: true)
	this.autoNap  = auto;   // Tự động nạp tiền mang vào
}

Player.prototype.addRoom = function(room){
	this.room = room;
	return this.room;
}

Player.prototype.outGame = function(){
	// Thoát game sẽ trả lại tiền vào tài khoản
	if (this.balans > 0) {
		var uInfo = {};
		if (this.red) {
			uInfo.red = this.balans;
		}else{
			uInfo.xu  = this.balans;
		}
		UserInfo.updateOne({id: this.uid}, {$inc:uInfo}).exec();
	}
}


module.exports = Player;
