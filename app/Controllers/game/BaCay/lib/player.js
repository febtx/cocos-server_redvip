
let UserInfo = require('../../../../Models/UserInfo');

let Player = function(client, game){
	this.room    = null;  // Phòng
	this.map     = null;  // vị trí ghế ngồi

	this.isPlay  = false; // người chơi đang chơi
	this.isOut   = false; // người chơi đã thoát

	this.uid     = client.UID;          // id người chơi
	this.name    = client.profile.name; // tên người chơi
	this.avatar  = client.profile.avatar; // Avatar

	this.client    = client; // địa chỉ socket của người chơi
	this.game      = game;   // game (100/1000/5000/10000/...)
	this.boCard    = [];     // Bộ bài
	this.betChuong = 0; // Cược chương
	this.betGa     = 0; // Cược gà
}

module.exports = Player;
