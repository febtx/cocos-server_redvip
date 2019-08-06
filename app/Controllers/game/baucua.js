
const cuoc     = require('./baucua/cuoc');
const regOpen  = require('./baucua/regOpen');
const viewlogs = require('./baucua/viewlogs');
const tops     = require('./baucua/tops');


module.exports = function(client, data){
	if (void 0 !== data.view) {
		client.gameEvent.viewBauCua = !!data.view;
	}
	if (void 0 !== data.regOpen) {
		regOpen(client);
	}
	if (void 0 !== data.cuoc) {
		cuoc(client, data.cuoc)
	}
	if (void 0 !== data.tops) {
		tops(client, data.tops)
	}
	if (void 0 !== data.viewlogs) {
		viewlogs(client, data.viewlogs)
	}
};
