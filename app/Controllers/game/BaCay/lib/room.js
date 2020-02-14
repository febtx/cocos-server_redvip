
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
};

module.exports = BaCay;
