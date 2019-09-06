
var angrybird  = require('./bot_hu/angrybird');
var bigbabol   = require('./bot_hu/bigbabol');
var candy      = require('./bot_hu/candy');
var longlan    = require('./bot_hu/longlan');


module.exports = function(io, listBot){
	angrybird(io, listBot);
	bigbabol(io, listBot);
	candy(io, listBot);
	longlan(io, listBot);
};
