
let BanCa = function(){
	this.wait1 = {};
	this.wait2 = {};
	this.wait3 = {};

	this.bet = {
		1:{0:1,  1:2,  2:3,  3:5,  4:7,  5:10},
		2:{0:10, 1:20, 2:30, 3:50, 4:70, 5:100},
		3:{0:100,1:200,2:300,3:500,4:700,5:1000},
	};
}

BanCa.prototype.addWait = function(wait, room){
	this['wait'+wait][room.id] = room;
	return room;
}

BanCa.prototype.removeWait = function(wait, id){
	delete this['wait'+wait][id];
}

module.exports = BanCa;
