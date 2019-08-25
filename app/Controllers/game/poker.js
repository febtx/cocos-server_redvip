
const reg      = require('./poker/reg'); // đăng kí vào phòng

module.exports = function(client, data){
	if (!!data.reg) {
		reg(client, data.reg);
	}
};
