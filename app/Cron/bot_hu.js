
var angrybird  = require('./bot_hu/angrybird');
var bigbabol   = require('./bot_hu/bigbabol');
var candy      = require('./bot_hu/candy');
var longlan    = require('./bot_hu/longlan');
var mini3cay   = require('./bot_hu/mini3cay');
var minipoker  = require('./bot_hu/minipoker');
var vqred      = require('./bot_hu/vqred');

module.exports = function(io, listBot){
	angrybird(io, listBot);
	bigbabol(io, listBot);
	candy(io, listBot);
	longlan(io, listBot);
	mini3cay(io, listBot);
	minipoker(io, listBot);
	vqred(io, listBot);
};
