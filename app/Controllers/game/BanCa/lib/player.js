
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

	this.meBulllet = {};
}


Player.prototype.collision = function(data){
	let bullet_id = data.id>>0;
	let fish_id   = data.f>>0;

	let bullet = this.meBulllet[bullet_id];
	let fish   = this.room.fish[fish_id];

	if (void 0 !== bullet) {
		delete this.meBulllet[bullet_id];
		if (void 0 !== fish) {
			fish.coll[bullet.type]--;
			if (fish.coll[bullet.type] < 1) {
				delete this.room.fish[fish_id];
				this.room.sendToAll({otherEat:{id:fish_id, money:fish, map:this.map, anim:1}}, this);
			}
		}
	}
}

Player.prototype.changerTypeBet = function(bet){
	bet = bet>>0;
	if (bet >= 0 && bet <= 5) {
		this.updateTypeBet(bet);
		this.room.sendToAll({other:{updateType:{type:bet, map:this.map}}}, this);
	}
}

Player.prototype.bullet = function(bullet){
	if(this.money >= this.bet){
		let id = bullet.id>>0;
		this.money -= this.bet;
		this.meBulllet[id] = {type:this.typeBet, bet:this.bet};
		this.client.red({me:{money:this.money}});
		if (void 0 !== bullet.f) {
			this.room.sendToAll({other:{bulllet:{money:this.money, map:this.map, f:bullet.f}}}, this);
		}else{
			let x = bullet.x>>0;
			let y = bullet.y>>0;
			this.room.sendToAll({other:{bulllet:{money:this.money, map:this.map, x:x, y:y}}}, this);
		}
	}
}

Player.prototype.updateTypeBet = function(bet = null){
	if (bet !== null) {
		this.bet = this.room.root.bet[this.game][bet];
		this.typeBet = bet;
	}else{
		this.bet = this.room.root.bet[this.game][this.typeBet];
	}
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

Player.prototype.lock = function(fish){
	if (void 0 !== this.room.fish[fish]) {
		this.room.sendToAll({lock:{f:fish, map:this.map}}, this);
	}
}

Player.prototype.unlock = function(){
	this.room.sendToAll({unlock:this.map}, this);
}

module.exports = Player;
