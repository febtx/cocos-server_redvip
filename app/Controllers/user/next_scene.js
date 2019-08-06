
module.exports = function(client){
	client.send(JSON.stringify({
		taixiu: {time_remain: client.redT.TaiXiu_time},
		mini:   {baucua:{time_remain: client.redT.BauCua_time}}
	}));
}
