
module.exports = function(client){
	let xocxoc = client.redT.game.xocxoc;
	if (xocxoc.clients[client.UID] === client) {
		delete xocxoc.clients[client.UID];
	}
	xocxoc = null;
	client = null;
};
