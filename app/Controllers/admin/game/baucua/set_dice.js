
var fs       = require('fs');
var fileName = '../../../../../data/baucua.json';

module.exports = function(client, data) {
	var file = require(fileName);
	//if (file.rights < client.rights || file.uid == client.UID) {
		Object.assign(file, data);
		file.uid    = client.UID;
		file.rights = client.rights;
		fs.writeFile(fileName, JSON.stringify(file), function(err){
			if (!!err) {
				client.send(JSON.stringify({notice:{title:'THẤT BẠI', text:'Đặt kết quả thất bại...'}}));
			}else{
				Promise.all(client.redT.admins[client.UID].map(function(obj){
					obj.send(JSON.stringify({baucua:{dices:[file[0], file[1], file[2]]}}));
				}));
				//client.send(JSON.stringify({notice:{title:'THÀNH CÔNG', text:'Đặt kết quả thành công...'}}));
			}
		});

	//}else{
		// đã có admin đặt
	//}
	//console.log(data)
	//console.log(client.rights)
}
