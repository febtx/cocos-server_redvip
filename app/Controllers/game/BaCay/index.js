
let reg    = require('./reg');    // đăng kí vào phòng
let ingame = require('./ingame'); // vào phòng

module.exports = function(client, data){
	if (!!data.reg) {
		reg(client, data.reg);
	}
	if (!!data.ingame) {
		ingame(client);
	}
	if (!!client.bacay) {
		if (!!data.card) {
			//client.bacay.viewCard(data.card);
		}
		if (!!data.lat) {
			client.bacay.onLat();
		}
		if (!!data.cuocG) {
			client.bacay.cuocGa();
		}
		if (!!data.cuocC) {
			client.bacay.cuocChuong(data.cuocC);
		}
		if (!!data.regOut) {
			client.bacay.onRegOut();
		}

	}
	client = null;
	data = null;
};
