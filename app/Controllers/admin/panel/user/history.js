
var chuyen = require('./history/chuyen');

module.exports = function(client, data){
	if (!!data.chuyen) {
		chuyen(client, data.chuyen);
	}
}
