
let HU          = require('../../../Models/HU');

let MegaJP_user = require('../../../Models/MegaJP/MegaJP_user');

let UserInfo    = require('../../../Models/UserInfo');

let megaData    = require('../../../../data/megajackpot');

function random(){
	let a = (Math.random()*21)>>0;
	if (a == 20) {
		return 5; // free
	}else if (a >= 18 && a < 20) {
		return 4; // x 1500
	}else if (a >= 16 && a < 18) {
		return 3; // x1000
	}else if (a >= 12 && a < 16) {
		return 2; // x500
	}else{
		return 1; // x250
	}
}

module.exports = function(client, game){
	game = game>>0;
	if (game === 100 || game === 1000 || game === 10000) {
		MegaJP_user.findOne({uid:client.UID}, {}, function(err, dataJP){
			if (!!dataJP && dataJP[game] > 0) {
				let kq     = random();
				let dataKQ = megaData[game][kq];
				if (kq !== 5) {
					dataJP[game] -= 1;
					dataJP.save();
				}else{
					// cộng tiền
				}
				// Quay
				client.red({mini:{megaj:{status:{status:true, data:dataKQ, kq:kq, game:game}, info:{100:dataJP[100], 1000:dataJP[1000], 10000:dataJP[10000]}}}});
			}else{
				client.red({mini:{megaj:{status:{status:false}, notice:'Bạn không có lượt quay nào.!!'}}});
			}
		});
	}else{
		client.red({mini:{megaj:{status:{status:false}, notice:'Dữ liệu không đúng.!!'}}});
	}
};
