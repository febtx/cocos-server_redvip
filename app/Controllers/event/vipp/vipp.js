
let TopVip = require('../../../Models/VipPoint/TopVip');
let fs     = require('fs');

module.exports = function(client){
	fs.readFile('./config/topVip.json', 'utf8', function(err, file){
		try{
			if(!err){
				file = JSON.parse(file);
				TopVip.find({}, {}, {sort:{'vip':-1}, limit:file.member}, function(err, result){
					client.red({vipp:{config:file, top:result}});
					file = null;
					client = null;
				});
			}
		}catch(e){
		}
	});
};
