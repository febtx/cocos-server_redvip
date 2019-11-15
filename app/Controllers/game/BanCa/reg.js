
let UserInfo = require('../../../Models/UserInfo');
let Helpers  = require('../../../Helpers/Helpers');

let Player   = require('./lib/player');
let Room     = require('./lib/room');

let crypto = require('crypto');

module.exports = function(client, data){
	if (!!data.room && !!data.balans) {
		let room   = data.room>>0;
		let balans = data.balans>>0;
		if (room === 1 || room === 2 || room === 3){
			/**
			let min = room*20;
			let max = room*200;
			if (balans < min || balans > max) {
				client.red({notice:{title:'THẤT BẠI', text:'Dữ liệu không đúng...', load: false}});
			}else{
				*/
				let inGame = false;
				client.redT.users[client.UID].forEach(function(obj){
					if(!!obj.fish){
						inGame = true;
					}
				});
				if (inGame) {
					client.red({notice:{title:'CẢNH BÁO', text:'Bạn hoặc ai đó đang chơi BẮN CÁ bằng tài khoản này ...', load: false}});
				}else{
					client.fish = new Player(client, room, balans);
					// Tìm phòng chờ
					let PhongCho = Object.values(client.redT.game.fish['wait'+room]);
					console.log(PhongCho);
					PhongCho = PhongCho[0];
					if (PhongCho !== void 0) {
						// có phòng chờ
						PhongCho.inRoom(client.fish);
					}else{
						// tạo phòng mới
						let singID = new Date().getTime() + client.UID;
						singID = crypto.createHash('md5').update(singID).digest('hex');

						console.log(client.redT.game.fish);

						let Game = new Room(client.redT.game.fish, singID, room);

						client.redT.game.fish['wait'+room][singID] = Game; // Thêm phòng chờ
						Game.inRoom(client.fish);
					}
					client.red({notice:{title:'CẢNH BÁO', text:'Vào phòng ...', load: false}});
				}
			//}
		}else{
			client.red({notice:{title:'THẤT BẠI', text:'Dữ liệu không đúng...', load: false}});
		}
	}
}
