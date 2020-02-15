
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
	this.balans    = 0; // TK

	this.addRoom = function(room){
		this.room = room;
		return this.room;
	}

	this.outGame = function(kick = false){
		// Thoát game sẽ trả lại tiền vào tài khoản và thoát game
		if (kick) {
			this.client.red({kick:true});
		}
		this.isOut = true;
		this.client.bacay = null;
		this.client = null;

		if (!!this.room){
			this.room.outroom(this);
		}
		this.room = null;
		/**
		if (this.balans > 0) {
			UserInfo.updateOne({id:this.uid}, {$inc:{red:this.balans}}).exec();
		}
		*/
	}
}

module.exports = Player;
