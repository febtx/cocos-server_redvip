
let list = require('./bank/list');
let rut  = require('./bank/rut');

module.exports = function(client, data){
	if (!!data.list) {
		list(client);
	}
	if (!!data.rut) {
		rut(client, data.rut);
	}
}
