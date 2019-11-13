
let reg = require('./reg');    // đăng kí vào phòng

module.exports = function(client, data){
	if (!!data.reg) {
		reg(client, data.reg);
	}
	if (!!data.outgame && !!client.fish) {
		client.fish.outGame();
	}
};
