
var path     = require('path');
var fs       = require('fs');

module.exports = function(client, data) {
	var file = require('../../../../../config/LongLan.json');
	var chedo = null;
	if (data == "0") {
		chedo = 0;
	}
	if (data == "1") {
		chedo = 1;
	}
	if (data == "2") {
		chedo = 2;
	}
	if (chedo !== null) {
		file.chedo = chedo;
		fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + "/config/LongLan.json", JSON.stringify(file), function(err){
			if (!!err) {
				client.red({notice:{title:'THẤT BẠI', text:'đổi chế độ thất bại...'}});
			}
			client.red({notice:{title:'Tesst', text:'đổi chế độ...'}});
		});
	}else{
		client.red({notice:{title:'THẤT BẠI', text:'đổi chế độ thất bại...'}});
	}
}
