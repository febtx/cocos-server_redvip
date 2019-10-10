
module.exports = function(client){
	let xocxoc = client.redT.game.xocxoc;
	if (xocxoc.clients[client.UID] === client) {
		// Lấy thông tin phòng
		let data = {};
		data.time   = xocxoc.time;
		data.data   = xocxoc.data;
		data.client = Object.keys(xocxoc.clients).length;

		client.red({xocxoc:{ingame:data}});
		data = null;
	}else{
		// trở lại màn hình trang chủ
		client.red({toGame:'MainGame'});
	}
	xocxoc = null;
	client = null;
};
