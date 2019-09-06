
var angrybird  = require('./bot_hu/angrybird');
var bigbabol   = require('./bot_hu/bigbabol');



module.exports = function(io, listBot){
	angrybird(io, listBot);
	bigbabol(io, listBot);
};
