
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
	this.betChuong = 0; // Cược chương
	this.betGa     = 0; // Cược gà
	this.balans    = 0; // TK
	this.win       = 0; // Thắng
	this.lost      = 0; // Thua
	this.totall    = 0; // Tổng tiền thắng thua sau game
	this.toNhat    = null;

	this.isLat     = false;

	this.point     = 0; // Điểm

	// vào phòng chơi
	this.addRoom = function(room){
		this.room = room;
		return this.room;
	}

	// thoát game
	this.outGame = function(kick = false){
		// Thoát game sẽ trả lại tiền vào tài khoản và thoát game
		if (kick && this.client) {
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

	// đặt lại dữ liệu để tiếp tục ván mới
	this.newGame = function(){
		this.card        = null;  // Bộ bài
		this.point       = 0;     // Điểm
		this.betChuong   = 0;     // số tiền cược Chương
		this.betGa       = 0;     // số tiền cược Gà
		this.isPlay      = false;
		this.toNhat      = null;
		this.win         = 0; // Win
		this.lost        = 0; // Lost
		this.totall      = 0; // Tổng tiền thắng thua sau game
		this.isLat       = false;
	}

	// Cược Chương
	this.cuocChuong = function(bet){
		if (this.room.game_round === 1) {
			bet = bet>>0;
			if (this.game <= bet && bet <= this.game*2) {
				UserInfo.findOne({id:this.uid}, 'red').exec(function(err, user){
					if (!!user) {
						if (user.red >= bet) {
							user.red -= bet;
							user.save();
							this.betChuong = bet;
							this.balans    = user.red*1;
							this.room.bet_chuong += bet;
							this.room.sendToAll({game:{player:{map:this.map, bet:this.betChuong, isBetChuong:true, balans:this.balans, betChuong:this.betChuong, betGa:this.betGa}}});
						}else{
							this.client.red({game:{notice:'Số dư không khả dụng.'}, user:{red:user.red}});
						}
					}
				}.bind(this));
			}
		}
	}

	// Cược Gà
	this.cuocGa = function(){
		if (this.room.game_round === 1) {
			UserInfo.findOne({id:this.uid}, 'red').exec(function(err, user){
				if (!!user) {
					if (user.red >= this.game){
						user.red -= this.game;
						user.save();
						this.balans = user.red*1;
						this.betGa  = this.game;
						this.room.bet_ga += this.game;
						this.room.sendToAll({infoRoom:{betGa:this.room.bet_ga}, game:{player:{map:this.map, bet:this.betGa, balans:this.balans, betChuong:this.betChuong, betGa:this.betGa}}});
					}else{
						this.client.red({game:{notice:'Số dư không khả dụng.'}, user:{red:user.red}});
					}
				}
			}.bind(this));
		}
	}


	// Lật bài
	this.onLat = function(){
		if (this.room.game_round === 2 && this.isLat == false) {
			this.isLat = true;
			this.room.sendToAll({game:{lat:{map:this.map, card:this.card, point:this.point}}}, this);
		}
	}
}

module.exports = Player;
