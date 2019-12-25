
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, game, balans, auto){
	this.room     = null;  // Phòng
	this.map      = null;  // vị trí ghế ngồi

	this.isInGame = false; // người chơi đang
	this.isPlay   = false; // người chơi đang chơi
	this.isOut    = false; // người chơi đã thoát

	this.uid     = client.UID;          // id người chơi
	this.name    = client.profile.name; // tên người chơi

	this.client  = client; // địa chỉ socket của người chơi
	this.game    = game;   // game (100/1000/5000/10000/...)
	this.balans  = balans; // sô tiền mang vào
	this.autoNap = auto;   // Tự động nạp tiền mang vào
	this.isTheo  = false;  // đang theo/xem
	this.isAll   = false;  // đang tất tay

	this.d       = false;
}

Player.prototype.addRoom = function(room){
	this.room = room;
	return this.room;
}

Player.prototype.outGame = function(){
	// Thoát game sẽ trả lại tiền vào tài khoản và thoát game

	this.isOut = true;
	this.client.poker = null;
	this.client = null;

	if (!!this.room) {
		this.room.outroom(this);
	}

	if (this.balans > 0) {
		var uInfo = {};
		uInfo.red = this.balans;
		UserInfo.updateOne({id:this.uid}, {$inc:uInfo}).exec();
	}
}

Player.prototype.onHuy  = function(){
}
Player.prototype.onXem  = function(){
}
Player.prototype.onTheo = function(){
}
Player.prototype.onTo   = function(to){
}
Player.prototype.onAll  = function(){
}

module.exports = Player;
