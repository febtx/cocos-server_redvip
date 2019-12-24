
var Helpers   = require('../../../../Helpers/Helpers');
var base_card = require('../../../../../data/card');

var Poker = function(poker, singID, game){
	this.poker  = poker; // quản lý các phòng
	this.singID = singID;
	this.game   = game;

	poker.addRoom(this);

	this.online = 0;

	this.card   = [];    // bài

	// ghế ngồi có sẵn 
	this.player = {
		1: {id:1,
			data:null},
		2: {id:2,
			data:null},
		3: {id:3,
			data:null},
		4: {id:4,
			data:null},
		5: {id:5,
			data:null},
		6: {id:6,
			data:null},
	};

	this.playerWait   = {}; // người chơi đang chờ phiên mới // chờ vào ván mới
	this.playerInGame = []; // người chơi trong ván chơi     // bỏ bài
	this.playerPlay   = []; // đang chơi                     // đang chơi

	this.isPlay       = false; // phòng đang chơi
	this.timeOut      = null;  // thời gian

	this.d            = null;  // Người chơi đầu tiên / lượt chơi
	this.round        = 0;
};

Poker.prototype.sendTo = function(client, data){
	client.red(data);
}

Poker.prototype.sendToAll = function(data, player = null){
	var trongPhong = Object.values(this.player); // danh sách ghế
	trongPhong.forEach(function(ghe){
		if (!!ghe.data && ghe.data !== player) {
			!!ghe.data.client && ghe.data.client.red(data);
		}
	});
}

Poker.prototype.inroom = function(player){
	this.online++;

	if (this.online > 5) {
		this.poker.removeRoom(this.game, this.singID);
	}else{
		this.poker.addRoom(this);
	}

	player.room = this;
	var trongPhong = Object.values(this.player);                          // danh sách ghế
	var gheTrong = trongPhong.filter(function(t){return t.data == null}); // lấy các ghế trống

	// lấy ngẫu nhiên 1 ghế trống và ngồi
	var rand = (Math.random()*gheTrong.length)>>0;
	gheTrong = gheTrong[rand];

	this.player[gheTrong.id].data = player; // ngồi
	player.map = gheTrong.id;               // vị trí ngồi

	this.sendToAll({ingame:{ghe:player.map, data:{name:player.name, balans:player.balans}}}, player);

	trongPhong = Object.values(this.player); // danh sách ghế
	let result = trongPhong.map(function(ghe){
		if (!!ghe.data) {
			return {ghe:ghe.id, data:{name:ghe.data.name, balans:ghe.data.balans}};
		}else{
			return {ghe:ghe.id, data:null};
		}
	});
	var client = {infoGhe:result, infoRoom:{game:player.game}, meMap:player.map};
	this.sendTo(player.client, client);

	this.online == 1 && (this.d = player);
	this.online > 1 && this.checkGame();
}

Poker.prototype.outroom = function(player){
	this.online--;
	if (this.online < 1) {
		this.poker.removeRoom(this.game, this.singID);
	}

	this.player[player.map].data = null;
	this.sendToAll({outgame:player.map});

	if (this.online == 1) {
		this.isPlay = false;
		if (!!this.timeOut) {
			clearTimeout(this.timeOut);
			this.timeOut = null;
		}
	}
	if (this.d == player) {
		this.resetD();
	}
}

Poker.prototype.checkGame = function(){
	if (!this.isPlay && !this.timeOut) {
		this.timeOut = setTimeout(function(){
			let trongPhong = Object.values(this.player);                      // danh sách ghế
			let ghe = trongPhong.filter(function(t){return t.data !== null}); // ghế có người ngồi

			//this.isPlay  = true;
			this.playerWait = {}; // người được chơi trong phiên sắp tới

			let result = ghe.map(function(player){
				this.playerWait[player.id] = {id:player.id, data:player.data};
				return {ghe:player.id, data:{progress:5}};
			}.bind(this));
			this.sendToAll({game:{start:result}});
			this.timeOut = setTimeout(function(){
				this.playerInGame = Object.values(this.playerWait); // danh sách người chơi
				// vị trí người chơi đầu tiên trong mảng,
				this.indexBegin = this.playerInGame.findIndex(function(obj){
					return obj.ghe == this.d.map;
				}.bind(this));
				this.Round1();
			}.bind(this), 5000);
		}.bind(this), 1000);
	}
}

// Round 1 // Chia 2 lá đầu
Poker.prototype.Round1 = function(){
	this.card = [...base_card.card]; // bộ bài mới
	// chia bài
}

// Round 2 // mở 3 lá
Poker.prototype.Round2 = function(){
}

Poker.prototype.resetD = function(){
}

module.exports = Poker;
