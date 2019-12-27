
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, game, balans, auto){
	this.room    = null;  // Phòng
	this.map     = null;  // vị trí ghế ngồi

	this.isHuy   = false; // người chơi đã hủy bài
	this.isOut   = false; // người chơi đã thoát

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
	this.room.onHuy(this);
	this.isOut = true;
	this.client.poker = null;
	this.client = null;

	if (!!this.room) {
		this.room.outroom(this);
	}

	if (this.balans > 0) {
		let uInfo = {};
		uInfo.red = this.balans;
		UserInfo.updateOne({id:this.uid}, {$inc:uInfo}).exec();
	}
}
Player.prototype.tralai = function(){
}
Player.prototype.onHuy  = function(){
	if(this.isHuy === false){
		this.room.onHuy(this);
	}
}
Player.prototype.onXem  = function(){
	if(this.isHuy === false){
		this.room.onTheo(this);
	}
}
Player.prototype.onTheo = function(){
	if(this.isHuy === false){
		this.room.onTheo(this);
	}
}
Player.prototype.onTo   = function(to){
	if(this.isHuy === false){
		this.room.onTo(this, to);
	}
}
Player.prototype.onAll  = function(){
	if(this.isHuy === false){
		this.room.onAll(this);
	}
}

module.exports = Player;
