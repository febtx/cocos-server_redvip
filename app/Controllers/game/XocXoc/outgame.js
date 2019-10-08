
module.exports = function(client){
	let xocxoc = client.redT.game.xocxoc;
	if (xocxoc.clients[client.UID]) {
		delete xocxoc.clients[client.UID];
	}
	console.log(xocxoc.clients);
	xocxoc = null;
	client = null;
};
