
let lo2  = require('./mb/lo2so');

module.exports = function(client, data){
	if (!!data.lo2) {
		lo2(client, data.lo2);
	}
	client = null;
	data   = null;
};
