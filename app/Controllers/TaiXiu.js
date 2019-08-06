
const TaiXiu     = require('./taixiu/index.js');
const getLogChat = require('./taixiu/getLogChat');

module.exports = function(client, data){
	if (void 0 !== data.view) {
		client.gameEvent.viewTaiXiu = !!data.view;
		console.log(data.view);
	}
	if (void 0 !== data.getLogs) {
		TaiXiu.getLogs(client);
	}
	if (void 0 !== data.cuoc) {
		TaiXiu.cuoc(client, data.cuoc);
	}
	if (void 0 !== data.chat) {
		TaiXiu.chat(client, data.chat);
	}
	if (void 0 !== data.get_phien) {
		TaiXiu.get_phien(client, data.get_phien);
	}
	if (void 0 !== data.get_log) {
		TaiXiu.get_log(client, data.get_log);
	}
	if (void 0 !== data.get_top) {
		TaiXiu.get_top(client, data.get_top);
	}
	if (void 0 !== data.get_new) {
		TaiXiu.getNew(client);
	}
	if (void 0 !== data.getLogChat) {
		getLogChat(client);
	}
	
}
