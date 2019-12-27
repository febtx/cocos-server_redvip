
var Helpers   = require('../../../../Helpers/Helpers');
var base_card = require('../../../../../data/card');

var Poker = function(poker, singID, game){
	this.poker  = poker;  // quản lý các phòng
	this.singID = singID; // ID phòng
	this.game   = game;   // game (100/1000/5000/10000/...)
	poker.addRoom(this);
	this.online   = 0;    // số người trong phòng
	this.card     = [];   // bộ bài
	this.mainCard = [];   // bài trên bàn

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

	this.playerInGame = []; // đang chơi

	this.isPlay       = false; // phòng đang chơi
	this.timeOut      = null;  // thời gian

	this.d            = null;  // Người chơi đầu tiên
	this.i_first      = 0;     // người chơi đầu tiên
	this.i_last       = 0;     // người chơi sau cùng

	this.game_player  = null;  // người chơi hiện tại
	this.game_to      = false; // Game đang trong quá trình tố
	this.game_bet     = 0;     // cược hiện tại của game
	this.game_time    = 0;     // mini time
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

	if(this.online == 1){
		this.d = player.map;
		player.d = true;
	}

	this.sendToAll({ingame:{ghe:player.map, data:{name:player.name, balans:player.balans, d:player.d}}}, player);

	trongPhong = Object.values(this.player); // danh sách ghế
	let result = trongPhong.map(function(ghe){
		if (!!ghe.data) {
			if (this.isPlay === true) {
				return {ghe:ghe.id, data:{name:ghe.data.name, balans:ghe.data.balans, bet:ghe.data.bet, card:{}}};
			}
			return {ghe:ghe.id, data:{name:ghe.data.name, balans:ghe.data.balans, d:ghe.data.d}};
		}else{
			return {ghe:ghe.id, data:null};
		}
	}.bind(this));
	let client = {infoGhe:result, infoRoom:{game:player.game}, meMap:player.map};
	if (this.isPlay === true) {
		client.game = {card:this.mainCard};
	}
	this.sendTo(player.client, client);
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
	player.room = null;
	player.d    = null;
	if (this.d == player.map) {
		this.resetD();
	}
}

Poker.prototype.checkGame = function(){
	if (!this.isPlay && !this.timeOut) {
		this.isPlay    = true;
		this.game_time = new Date().getTime();
		this.timeOut   = setTimeout(function(){
			clearTimeout(this.timeOut);
			 // ghế có người ngồi
			let nguoichoi = Object.values(this.player).filter(function(t){return t.data !== null});
			if (nguoichoi.length < 2) {
				return void 0;
			}
			this.playerInGame = [];

			nguoichoi.forEach(function(player, index){
				this.playerInGame[index] = {id:player.map, data:player.data};
			});
			// vị trí người chơi đầu tiên trong mảng,
			this.i_first = this.playerInGame.findIndex(function(obj){
				return (obj.id == this.d);
			}.bind(this));
			this.game_bet = this.game;
			this.Round1();
		}.bind(this), 3000);
	}
}

// Vòng 1: Chia 2 lá đầu
Poker.prototype.Round1 = function(){
	this.card = [...base_card.card]; // bộ bài mới

	this.card = Helpers.shuffle(this.card); // tráo bài lần 1
	this.card = Helpers.shuffle(this.card); // tráo bài lần 2
	this.card = Helpers.shuffle(this.card); // tráo bài lần 3
	// chia bài
	let chia = [];
	this.playerInGame.forEach(function(player, index){
		player.data.card = this.card.splice(0, 2);
		chia[index] = {id:player.id};
	}.bind(this));
	this.playerInGame.forEach(function(player){
		chia.forEach(function(dataChia){
			if (dataChia.id == player.id) {
				dataChia.data = player.data.card;
			}else{
				delete dataChia.data;
			}
		});
		this.sendTo(player.data.client, {game:{chia_bai:chia}, infoRoom:{bet:this.game_bet}})
	}.bind(this));

	clearTimeout(this.timeOut);
	this.timeOut = setTimeout(function(){
		clearTimeout(this.timeOut);
		this.nextPlayer(true);
	}.bind(this), 500);
}

// Sang vòng mới
Poker.prototype.nextRound = function(){
	this.game_to = false; // đã tố song
	let round = this.mainCard.length;
	if (round < 5) {
		if (round === 0) {
			// Mở 3 lá nên bàn
			this.mainCard = this.mainCard.concat(this.card.splice(0, 3));
			this.sendToAll({game:{card:this.mainCard}});
		}else{
			// mở thêm 1 lá
			let card = this.card.splice(0, 1);
			this.mainCard = this.mainCard.concat(card);
			this.sendToAll({game:{card:card}});
		}
		clearTimeout(this.timeOut);
		this.timeOut = setTimeout(function(){
			clearTimeout(this.timeOut);
			this.nextPlayer(true);
		}.bind(this), 1000);
	}else{
		// đã đủ 5 lá và tính điểm
	}
}

// tới lượt người chơi tiếp theo
Poker.prototype.nextPlayer = function(new_round = false){
	clearTimeout(this.timeOut);
	this.game_time = new Date().getTime();
	if(new_round === true){
		this.i_last = this.i_first;
		this.game_player = this.playerInGame[this.i_first].data;

		if (this.game_player.isOut === true || this.game_player.isHuy === true) {
			this.nextPlayer();
			return void 0;
		}

		let resultG = {ghe:this.game_player.map, progress:15};
		this.sendToAll({game:{turn:resultG}}, this.game_player);

		resultG = {ghe:this.game_player.map, progress:15, select:this.btnSelect(this.game_player)};
		this.sendTo(this.game_player.client, {game:{turn:resultG}});

		this.timeOut = setTimeout(function(){
			clearTimeout(this.timeOut);
		}.bind(this), 1500);
	}else{
		this.i_last++;
		if(this.i_last >= this.playerInGame.length){
			this.i_last = 0;
		}
		if (this.i_last === this.i_first) {
			// kết thúc vòng chơi
			this.sendToAll({game:{offSelect:true}});
			//this.sendTo(this.game_player.client, {game:{offSelect:true}});
			this.game_player = null;
			this.nextRound();
			return void 0;
		}

		this.game_player = this.playerInGame[this.i_last].data;
		if (this.game_player.isOut === true || this.game_player.isHuy === true) {
			this.nextPlayer();
			return void 0;
		}

		let resultG = {ghe:this.game_player.map, progress:15};
		this.sendToAll({game:{turn:resultG}}, this.game_player);

		resultG = {ghe:this.game_player.map, progress:15, select:this.btnSelect(this.game_player)};
		this.sendTo(this.game_player.client, {game:{turn:resultG}});

		this.timeOut = setTimeout(function(){
			clearTimeout(this.timeOut);
		}.bind(this), 1500);
	}
}

Poker.prototype.btnSelect = function(player){
	let select = {xem:true, theo:true, to:true, all:true};
	if (player.isAll === true) {
		return {xem:true, theo:false, to:false, all:false};
	}
	if (this.game_to === true) {
		select.xem = false;
	}else{
		select.theo = false;
	}
	let bet = this.game_bet-player.bet;
	if (bet > player.balans) {
		select.theo = false;
		select.to   = false;
	}else if (bet == player.balans) {
		select.to = false;
	}
	return select;
}

Poker.prototype.resetD = function(){
	if (this.isPlay == true && this.playerInGame.length > 0) {
		//
	}else{
		let trongPhong = Object.values(this.player);                      // danh sách ghế
		trongPhong = trongPhong.filter(function(t){return t.data !== null}); // ghế có người ngồi
		// lấy ngẫu nhiên 1 ghế làm D
		let rand = (Math.random()*trongPhong.length)>>0;
		trongPhong = trongPhong[rand];
		if (trongPhong && trongPhong.data) {
			this.d = trongPhong.data.map;
			trongPhong.data.d = true;
		}
	}
}
// Theo
Poker.prototype.onTheo = function(player){
	if (this.game_player === player) {
		let bet = this.game_bet-player.bet;
		if (bet <= player.balans) {
			player.isTheo  = true;
			player.balans -= bet;
			player.bet    += bet;
			if (player.balans < 1) {
				player.isAll = true;
			}
			this.sendToAll({game:{player:{ghe:player.map, data:{balans:player.balans, bet:player.bet}}}});
			this.nextPlayer();
		}
	}
}
// Tố
Poker.prototype.onTo = function(player, to){
	if (this.game_player === player) {
		to = to>>0;
		let debit = this.game_bet-player.bet;   // số tiền đang thiếu
		let updateBalans = player.balans-debit; // số tiền còn lại khi trả đủ để thược hiện tố
		if (to <= updateBalans) {
			this.resetTheo();
			this.game_to  = true;
			player.balans = player.balans-(debit+to);
			player.bet    = player.bet+debit+to;
			this.game_bet += to;
			if (player.balans < 1) {
				player.isAll = true;
			}
			this.i_first = this.playerInGame.findIndex(function(obj){
				return (obj.id == player.map);
			}.bind(this));
			this.sendToAll({game:{player:{ghe:player.map, data:{balans:player.balans, bet:player.bet}}}, infoRoom:{bet:this.game_bet}});
			this.nextPlayer();
		}
	}
}

// Tất tay
Poker.prototype.onAll = function(player){
	if (this.game_player === player) {
		let debit = this.game_bet-player.bet;   // số tiền đang thiếu
		let updateBalans = player.balans-debit; // số tiền còn lại khi trả đủ để thược hiện tố
		player.bet   += player.balans;
		player.isAll  = true;
		player.balans = 0;
		if (updateBalans > 0) {
			this.resetTheo();
			this.game_to  = true;
			this.game_bet += updateBalans;
			this.i_first = this.playerInGame.findIndex(function(obj){
				return (obj.id == player.map);
			}.bind(this));
		}
		this.sendToAll({game:{player:{ghe:player.map, data:{balans:player.balans, bet:player.bet}}}, infoRoom:{bet:this.game_bet}});
		this.nextPlayer();
	}
}

Poker.prototype.resetTheo = function(){
	this.playerInGame.forEach(function(player){
		player.isTheo = false;
	});
}
Poker.prototype.onHuy = function(player){
	if (this.isPlay === true) {
		player.isHuy = true;
		let huy = this.playerInGame.filter(function(t){return t.data.isHuy === false}); // ghế chưa hủy bài
		if (huy.length > 1 && this.game_player === player) {
			this.nextPlayer();
			return void 0;
		}
		if (huy.length === 1) {
			this.resetData();
			let noHuy = huy[0];
			noHuy.data.balans += noHuy.data.bet;
			let objWin = {ghe:noHuy.data.map, data:{balans:noHuy.data.balans}, info:{win:0}};
			let array = [objWin];
			this.playerInGame.forEach(function(obj, index){
				if (noHuy.data !== obj.data) {
					if (obj.data.bet <= noHuy.data.bet) {
						// ăn tất
						objWin.info.win    += obj.data.bet;
						objWin.data.balans += obj.data.bet;
						noHuy.data.balans  += obj.data.bet;
						if (obj.data.isOut === false) {
							array = array.concat({ghe:obj.data.map, data:{balans:obj.data.balans}, info:{lost:obj.data.bet}});
						}
						obj.data.bet = 0;
					}else{
						// có trả lại
						objWin.info.win    += noHuy.data.bet;
						objWin.data.balans += noHuy.data.bet;
						noHuy.data.balans  += noHuy.data.bet;
						if (obj.data.isOut) {
							obj.data.du = obj.data.bet-noHuy.data.bet;
							obj.data.tralai();
						}else{
							obj.data.balans += obj.data.bet-noHuy.data.bet;
							array = array.concat({ghe:obj.data.map, data:{balans:obj.data.balans}, info:{lost:noHuy.data.bet}});
						}
						obj.data.bet = 0;
					}
				}
				obj.data.isTheo = false;
				obj.data.isAll  = false;
				obj.data.isHuy  = false;
			});
			console.log(array);
			this.sendToAll({game:{info:array, offSelect:true}});
		}
	}
}

Poker.prototype.resetData = function(){
	this.game_player = null;
	this.isPlay      = false;
	clearTimeout(this.timeOut);
	this.timeOut     = null;
	this.card        = [];
	this.mainCard    = [];
	//this.playerInGame.forEach(function(data){
		//data.id = null;
		//data.data = null;
	//});
}

module.exports = Poker;
