
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
		4: {'b':4,   'max':5,   'min':1,   'clip':4},
		5: {'b':4,   'max':6,   'min':2,   'clip':4},
		6: {'b':4,   'max':5,   'min':2,   'clip':5},
		7: {'b':5,   'max':7,   'min':2,   'clip':18},
		8: {'b':5,   'max':7,   'min':2,   'clip':18},
		9: {'b':8,   'max':12,  'min':3,   'clip':14},
		10:{'b':10,  'max':14,  'min':5,   'clip':14},
		11:{'b':10,  'max':14,  'min':5,   'clip':14},
		12:{'b':12,  'max':18,  'min':5,   'clip':14},
		13:{'b':15,  'max':22,  'min':5,   'clip':14},
		14:{'b':15,  'max':22,  'min':5,   'clip':14},
		15:{'b':15,  'max':22,  'min':5,   'clip':14},
		16:{'b':30,  'max':50,  'min':5,   'clip':14},
		17:{'b':40,  'max':70,  'min':5,   'clip':14},
		18:{'b':50,  'max':85,  'min':5,   'clip':14},
		19:{'b':50,  'max':89,  'min':5,   'clip':14},
		20:{'b':60,  'max':92,  'min':20,  'clip':14},
		21:{'b':80,  'max':120, 'min':30,  'clip':16},
		22:{'b':90,  'max':135, 'min':30,  'clip':16},
		23:{'b':100, 'max':140, 'min':50,  'clip':14},
		24:{'b':120, 'max':145, 'min':80,  'clip':14},
		25:{'b':130, 'max':150, 'min':90,  'clip':10},
		26:{'b':150, 'max':180, 'min':100, 'clip':8},
		27:{'b':200, 'max':270, 'min':100, 'clip':6},
	};
	this.group = {
		'1': {'g':'2_2g6', 'z':2, 'f':[2,2,2,2,2,2], 'clip':11},
		'20':{'g':'r1', 'f':[16,16,9,9,9,9,9,9,9,9,2,2,2,2,2,2,6,6,6,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,18,18,18], 'clip':2, 't':56},
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
