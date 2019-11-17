
let reg = require('./reg');    // đăng kí vào phòng

module.exports = function(client, data){
	if (!!data.reg) {
		reg(client, data.reg);
	}
	if (!!data.outgame && !!client.fish) {
		client.fish.outGame();
	}
	if (void 0 !== data.typeBet) {
		client.fish.changerTypeBet(data.typeBet);
	}
	if (void 0 !== data.bullet) {
		client.fish.bullet(data.bullet);
	}
	if (!!data.collision) {
		/**
		{
			fish: id cá
			bullet: id đạn
		}
		*/
	}
};
