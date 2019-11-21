
var Room = function(root, id, room){
	this.root = root; // Root
	this.id   = id;   // ID phòng
	this.room = room; // loại phòng

	this.timeWait = setTimeout(function(){
		clearTimeout(this.timeWait);
		this.root.removeWait(this.room, this.id);
		this.playGame();
	}.bind(this), 2000);  // thời gian chờ phòng

	this.timeFish = null; // thời gian ra cá

	this.fish = {};       // Cá
	this.fishID = 0;      // id

	// Những người chơi
	this.player = [
		{id:1, player:null},
		{id:2, player:null},
		{id:3, player:null},
		{id:4, player:null},
	]; // Những người chơi
}

Room.prototype.playGame = function(){
	this.timeFish = setInterval(function() {
		let id = this.fishID++;
		let fish = 1;
		let rand = (Math.random()*14)>>0;
		let f = {f:fish, anim:rand, coll:{0:this.collision(this.root.fish[fish]), 1:this.collision(this.root.fish[fish]), 2:this.collision(this.root.fish[fish]), 3:this.collision(this.root.fish[fish]), 4:this.collision(this.root.fish[fish]), 5:this.collision(this.root.fish[fish])}};
		this.fish[id] = f;
		this.sendToAll({fish:{id:id, f:fish, r:rand}});
	}.bind(this), 1000);
}

Room.prototype.collision = function(data) {
  return Math.floor(Math.random()*(data.max - data.min + 1)) + data.min;
}

Room.prototype.sendToAll = function(data, player = null){
	this.player.forEach(function(ghe){
		if (!!ghe.player && ghe.player !== player) {
			!!ghe.player.client && ghe.player.client.red(data);
		}
	});
}

Room.prototype.inRoom = function(player){
	let gheTrong = this.player.filter(function(t){return t.player === null}); // lấy các ghế trống
	let rand = (Math.random()*gheTrong.length)>>0;
	let Down = gheTrong[rand];
	//gheTrong = gheTrong[0];

	Down.player = player; // ngồi
	player.map = Down.id; // vị trí ngồi
	player.room = this;
	player.updateTypeBet();
	this.sendToAll({ingame:{ghe:player.map, data:{name:player.client.profile.name, balans:player.money, typeBet:player.typeBet}}}, player);

	let getInfo = this.player.map(function(ghe){
		if (!!ghe.player) {
			return {ghe:ghe.id, data:{name:ghe.player.client.profile.name, balans:ghe.player.money, typeBet:ghe.player.typeBet}};
		}else{
			return {ghe:ghe.id, data:null};
		}
	});
	let client = {infoGhe:getInfo, meMap:player.map};
	player.client.red(client);

	if (gheTrong.length === 1) {
		clearTimeout(this.timeWait);
		this.root.removeWait(this.room, this.id);
		this.playGame();
	}
}

Room.prototype.outRoom = function(player){
	this.player.forEach(function(obj, index) {
		if (obj.player === player) {
			obj.player = null;
		}
	});
	let gheTrong = this.player.filter(function(t){return t.player === null}); // lấy các ghế trống
	if (gheTrong.length === 4) {
		clearInterval(this.timeFish);
		clearTimeout(this.timeWait);
		console.log(this.root);
		this.root.removeWait(this.room, this.id);
		console.log('Remove Room');
		this.player.forEach(function(ghe){
			ghe = null;
		});
		// xóa phòng
		delete this.player;
		delete this.root;
	}else{
		this.sendToAll({outgame:player.map});
	}
}

module.exports = Room;
