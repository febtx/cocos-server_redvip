
var BaCay = function(bacay, singID, game){
	this.bacay  = bacay;  // quản lý các phòng
	this.singID = singID; // ID phòng
	this.game   = game;   // game (100/1000/5000/10000/...)
	bacay.addRoom(this);

	this.online   = 0;    // số người trong phòng
	this.card     = [];   // bộ bài

	// ghế ngồi có sẵn 
	this.player = {
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
		6: null,
	};

	this.playerInGame = []; // đang chơi

	this.isPlay       = false; // phòng đang chơi
	this.timeOut      = null;  // thời gian

	this.game_bet     = 0;     // cược hiện tại của game

	this.game_time     = 0;    // mini time

	this.game_start    = false; // game đã bắt đầu

	this.timeStartGame = 5;   // thời gian bắt đầu game
	this.time_start    = 0;    // thời gian bắt đầu game
	this.timePlayer    = 15;   // thời gian người chơi lựa chọn

	this.regTimeStart  = null; // Đăng ký thời gian bắt đầu

	this.sendToAll = function(data, player = null){
		Object.values(this.player).forEach(function(obj){
			if (!!obj && obj !== player && !!obj.client) {
				obj.client.red(data);
			}
		});
	}

	// Có người vào phòng
	this.inroom = function(player){
		this.online++;

		if (this.online > 5) {
			this.bacay.removeRoom(this.game, this.singID);
		}else{
			this.bacay.addRoom(this);
		}

		player.room = this;
		let trongPhong = Object.entries(this.player); // danh sách ghế
		let gheTrong = trongPhong.filter(function(t){return t[1] == null}); // lấy các ghế trống

		// lấy ngẫu nhiên 1 ghế trống và ngồi
		let rand = (Math.random()*gheTrong.length)>>0;
		gheTrong = gheTrong[rand];

		this.player[gheTrong[0]] = player; // ngồi
		player.map = gheTrong[0];          // vị trí ngồi

		trongPhong = Object.entries(this.player);

		let card = [];
		this.sendToAll({ingame:{ghe:player.map, data:{name:player.name, avatar:player.avatar, balans:player.balans}}}, player);
		let result = trongPhong.map(function(ghe){
			if (!!ghe[1]) {
				if (this.isPlay === true) {
					card = card.concat({ghe:ghe[0], card:{}});
					return {ghe:ghe[0], data:{name:ghe[1].name, avatar:ghe[1].avatar, balans:ghe[1].balans, betChuong:ghe[1].betChuong, betGa:ghe[1].betGa}};
				}
				return {ghe:ghe[0], data:{name:ghe[1].name, avatar:ghe[1].avatar, balans:ghe[1].balans}};
			}else{
				return {ghe:ghe[0], data:null};
			}
		}.bind(this));
		let client = {infoGhe:result, infoRoom:{game:player.game, isPlay:this.isPlay, time_start:this.time_start, card:card}, meMap:player.map};
		player.client.red(client);
		this.online > 1 && this.checkGame(5000);
	}

	// Có người thoát khỏi phòng
	this.outroom = function(player){
		this.online--;
		this.player[player.map] = null;

		if (this.online < 1) {
			this.destroy();
		}else{
			this.sendToAll({outgame:player.map});
			if (this.online == 1) {
				this.resetData();
			}
		}
	}

	// Đặt lại dữ liệu phòng
	this.resetData = function(){
		this.isPlay       = false;
		clearTimeout(this.timeOut);
		clearInterval(this.regTimeStart);
		this.timeOut      = null;
		this.regTimeStart = null;
		this.card         = [];
	}

	// Phá hủy phòng
	this.destroy = function(){
		this.resetData();
		this.bacay.removeRoom(this.game, this.singID);
	}

	// Kiểm tra và bắt chơi
	this.checkGame = function(wait){
		// 
	}
};

module.exports = BaCay;
