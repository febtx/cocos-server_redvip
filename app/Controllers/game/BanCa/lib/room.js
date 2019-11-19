
var Room = function(root, id, room){
	this.root = root; // Root
	this.id   = id; // ID phòng
	this.room = room; // loại phòng

	this.timeWait = setTimeout(function(){
		clearTimeout(this.timeWait);
		this.root.removeWait(this.room, this.id);
		this.playGame();
	}.bind(this), 2000); // thời gian chờ phòng


	this.timeFish = null; // thời gian ra cá

	// Các người chơi
	this.player = [
		{id:1, player:null},
		{id:2, player:null},
		{id:3, player:null},
		{id:4, player:null},
	]; // Các người chơi
}

Room.prototype.playGame = function(){
	this.timeFish = setInterval(function() {
		this.sendToAll({fish:{}});
	}.bind(this), 2000);
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
	gheTrong = gheTrong[rand];
	//gheTrong = gheTrong[0];

	gheTrong.player = player; // ngồi
	player.map = gheTrong.id; // vị trí ngồi
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
