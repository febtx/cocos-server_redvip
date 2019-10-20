
let HU          = require('../../../Models/HU');

let MegaJP_user = require('../../../Models/MegaJP/MegaJP_user');

let UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client, data){
	data = data>>0;
	if (data === 100 || data === 1000 || data === 10000) {
		MegaJP_user.findOne({uid:client.UID}, {}, function(err, dataJP){
			if (!!dataJP && dataJP[data] > 0) {
				dataJP[data] -= 1;
				dataJP.save();
				// Quay
				client.red({mini:{megaj:{status:{status:true}, notice:'Đang quay.!!'}}});
			}else{
				client.red({mini:{megaj:{status:{status:false}, notice:'Bạn không có lượt quay nào.!!'}}});
			}
		});
	}else{
		client.red({mini:{megaj:{status:{status:false}, notice:'Dữ liệu không đúng.!!'}}});
	}
};
