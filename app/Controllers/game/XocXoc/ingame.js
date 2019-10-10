
module.exports = function(client){
	let xocxoc = client.redT.game.xocxoc;
	if (xocxoc.clients[client.UID] === client) {
		// Lấy thông tin phòng
	}else{
		// trở lại màn hình trang chủ
		client.red({toGame:'MainGame'});
	}
	xocxoc = null;
	client = null;
};
