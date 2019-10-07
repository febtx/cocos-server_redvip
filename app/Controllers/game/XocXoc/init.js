
let XocXoc = function(io){
	this.io = io;
	this.clients = {};
	this.time = 0;
	this.data = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
		'xu': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};
	this.dataAdmin = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
		'xu': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};
	this.play();
}

XocXoc.prototype.play = function(){
	// chạy thời gian
	console.log('play');
}

XocXoc.prototype.thanhtoan = function(){
	// thanh toán phiên
}

module.exports = XocXoc;
