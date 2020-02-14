
let UserInfo = require('../../../Models/UserInfo');
let Player   = require('./lib/player');
let numberWithCommas  = require('../../../Helpers/Helpers').numberWithCommas;

module.exports = function(client, room){
	room = room>>0;
	if (room == 100 ||
		room == 200 ||
		room == 500 ||
		room == 1000 || 
		room == 2000 ||
		room == 5000 ||
		room == 10000 ||
		room == 20000 ||
		room == 50000 ||
		room == 100000 ||
		room == 200000 ||
		room == 500000)
	{
		let inGame = false;
		if (client.redT.users[client.UID]) {
			client.redT.users[client.UID].forEach(function(obj){
				if(!!obj.bacay){
					inGame = true;
				}
			});
			if (inGame) {
				client.red({notice:{title:'CẢNH BÁO', text:'Bạn hoặc ai đó đang chơi Ba Cây bằng tài khoản này ...', load:false}});
				room = null;
				client = null;
			}else{
				let min = room*4;
				UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
					if (!user || user.red < min) {
						client.red({notice:{title:'THẤT BẠI', text:'Bạn cần tối thiểu '+numberWithCommas(min)+' RED để vào phòng.!!', load:false}});
					}else{
						client.bacay = new Player(client, room);
						client.red({toGame:'3Cay'});
					}
					min  = null;
					room = null;
					client = null;
				});
			}
		}
	}else{
		client.red({notice:{title:'THẤT BẠI', text:'Dữ liệu không đúng...', load:false}});
		room = null;
		client = null;
	}
};
