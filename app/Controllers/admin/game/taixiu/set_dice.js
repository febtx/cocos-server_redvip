
//const TaiXiu = require('./game/taixiu.js')
var fs       = require('fs');
var fileName = '../../../../../data/taixiu.json';

module.exports = function(client, data) {
	var file = require(fileName);
	//if (file.rights < client.rights || file.uid == client.UID) {
		file.dice1  = data.dice1;
		file.dice2  = data.dice2;
		file.dice3  = data.dice3;
		file.uid    = client.UID;
		file.rights = client.rights;
		fs.writeFile(fileName, JSON.stringify(file), function(err){
			console.log(err);
			if (!!err) {
				client.send(JSON.stringify({notice:{title:'THẤT BẠI', text:'Đặt kết quả thất bại...'}}));
			}else{
				client.send(JSON.stringify({notice:{title:'THÀNH CÔNG', text:'Đặt kết quả thành công...'}}));
			}
		});

	//}else{
		// đã có admin đặt
	//}
	//console.log(data)
	//console.log(client.rights)
}
