

let fs = require('fs');

module.exports = function (client) {
	fs.readFile('./config/topVip.json', 'utf8', function(err, data){
		try{
			if(!err){
				data = JSON.parse(data);
				client.red({eventvip:data});
			}
		}catch(e){
		}
	});
}
