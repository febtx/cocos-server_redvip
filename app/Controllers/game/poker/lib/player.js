
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, game, balans, auto){
	this.room     = null;  // Phòng
	this.map      = null;  // vị trí ghế ngồi

	this.isInGame = false; // người chơi trong game
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

	this.bet     = 0; // số tiền cược
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
	// this.game_player
	if (this.room.game_player === this) {
		console.log('Huy');
	}
}
Player.prototype.onXem  = function(){
	this.room.onTheo(this);
}
Player.prototype.onTheo = function(){
	this.room.onTheo(this);
}
Player.prototype.onTo   = function(to){
	if (this.room.game_player === this) {
		console.log('To', to);
	}
}
Player.prototype.onAll  = function(){
	if (this.room.game_player === this) {
		console.log('All');
	}
}

module.exports = Player;
