
var UserInfo = require('../../../Models/UserInfo');
var Helpers  = require('../../../Helpers/Helpers');

var Player   = require('./lib/player');

module.exports = function(client, data){
	if (!!data.room && !!data.balans) {
		var room   = data.room>>0;
		var balans = data.balans>>0;
		var red    = !!data.red;
		var auto   = !!data.auto;

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
			let min = room*20;
			let max = room*200;
			if (balans < min || balans > max) {
				client.red({notice:{title:'THẤT BẠI', text:'Dữ liệu không đúng...', load: false}});
			}else{
				let inGame = false;
				if (client.redT.users[client.UID]) {
					client.redT.users[client.UID].forEach(function(obj){
						if(!!obj.poker){
							inGame = true;
						}
					});
					if (inGame) {
						client.red({notice:{title:'CẢNH BÁO', text:'Bạn hoặc ai đó đang chơi Poker bằng tài khoản này ...', load: false}});
					}else{
						UserInfo.findOne({id: client.UID}, 'red name', function(err, user){
							if (!user || user.red < min) {
								client.red({notice:{title:'THẤT BẠI', text:'Bạn cần tối thiểu RED để vào phòng.!!', load: false}});
							}else{
								if (user.red < balans) {
									var minMang = user.red;
									if (min < 1000000){
										minMang = (((minMang/room)*2)>>0)*(room/2);
									}else{
										minMang = (((minMang/min)*2)>>0)*(min/2);
									}
									client.red({notice:{title:'THẤT BẠI', text:'Bạn chỉ có thể mang tối đa ' + Helpers.numberWithCommas(minMang) + ' RED vào phòng chơi.!!', load: false}});
								}else{
									user.red -= balans;
									user.save();
									client.poker = new Player(client, room, balans, red, auto);
									client.red({toGame:'Poker'});
									//client.red({notice:{title:'BẢO TRÌ', text:'Game đang bảo trì...', load: false}});
								}
							}
						});
					}
				}
			}
		}else{
			client.red({notice:{title:'THẤT BẠI', text:'Dữ liệu không đúng...', load: false}});
		}
	}
};
