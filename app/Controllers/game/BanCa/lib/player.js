
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, game, money){
	this.room   = null;       // Phòng game
	this.map    = null;       // vị trí ghế ngồi
	this.uid    = client.UID; // id người chơi
	this.client = client;     // địa chỉ socket của người chơi
	this.game   = game;       // game (1/2/3)

	this.bet     = 0;         // Tiền mỗi viên đạn
	this.typeBet = 0;         // loại dạn (0: mặc định)

	this.moneyTotal = money;  // Tổng tiền mang vào
	this.money      = money;  // số tiền chơi
}

Player.prototype.addRoom = function(room){
	this.room = room;
	return void 0;
}

Player.prototype.outGame = function(){
	// Thoát game sẽ trả lại tiền vào tài khoản và thoát game

	this.client.fish = null;
	this.client      = null;

	if (!!this.room) {
		this.room.outRoom(this);
		this.room = null;
	}

	if (this.money > 0) {
		let uInfo = {red:this.money};
		UserInfo.updateOne({id:this.uid}, {$inc:uInfo}).exec();
	}
}

module.exports = Player;
