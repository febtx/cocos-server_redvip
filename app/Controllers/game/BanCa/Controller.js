
let BanCa = function(){
	this.wait1 = {};
	this.wait2 = {};
	this.wait3 = {};

	this.bet = {
		1:{0:1,  1:2,  2:3,  3:5,  4:7,  5:10},
		2:{0:10, 1:20, 2:30, 3:50, 4:70, 5:100},
		3:{0:100,1:200,2:300,3:500,4:700,5:1000},
	};

	this.fish = {
		1: {'b':2,   'max':3,   'min':1,   'clip':14},
		2: {'b':2,   'max':3,   'min':1,   'clip':1},
		3: {'b':3,   'max':5,   'min':1,   'clip':3},
		4: {'b':4,   'max':6,   'min':1,   'clip':4},
		5: {'b':4,   'max':6,   'min':1,   'clip':4},
		6: {'b':4,   'max':6,   'min':1,   'clip':5},
		7: {'b':5,   'max':9,   'min':1,   'clip':18},
		8: {'b':5,   'max':9,   'min':1,   'clip':18},
		9: {'b':8,   'max':15,  'min':1,   'clip':14},
		10:{'b':10,  'max':19,  'min':1,   'clip':14},
		11:{'b':10,  'max':19,  'min':1,   'clip':14},
		12:{'b':12,  'max':23,  'min':1,   'clip':14},
		13:{'b':15,  'max':29,  'min':1,   'clip':14},
		14:{'b':15,  'max':29,  'min':1,   'clip':14},
		15:{'b':15,  'max':29,  'min':1,   'clip':14},
		16:{'b':30,  'max':59,  'min':1,   'clip':14},
		17:{'b':40,  'max':79,  'min':1,   'clip':14},
		18:{'b':50,  'max':99,  'min':1,   'clip':14},
		19:{'b':50,  'max':95,  'min':1,   'clip':14},
		20:{'b':60,  'max':95,  'min':20,  'clip':14},
		21:{'b':80,  'max':125, 'min':30,  'clip':16},
		22:{'b':90,  'max':140, 'min':30,  'clip':16},
		23:{'b':100, 'max':140, 'min':50,  'clip':14},
		24:{'b':120, 'max':150, 'min':80,  'clip':14},
		25:{'b':130, 'max':160, 'min':90,  'clip':10},
		26:{'b':150, 'max':190, 'min':100, 'clip':8},
		27:{'b':200, 'max':280, 'min':100, 'clip':6},
	};
	this.group = {
		'1': {'g':'2_2g6', 'z':2, 'f':[2,2,2,2,2,2], 'clip':11},
		'20':{'g':'g1', 'f':[2,2,2,2,2,2], 'clip':2},
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
