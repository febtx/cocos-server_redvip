
const UserInfo = require('../../Models/UserInfo');
const helper   = require('../../Helpers/Helpers');


module.exports = function(client){
	UserInfo.findOne({id:client.UID}, 'red lastVip redPlay vip', function(err, user){
		var vipHT = ((user.redPlay-user.lastVip)/100000)>>0; // Điểm vip Hiện Tại
		var red      = 0; // Giá điểm vip

		if (vipHT >= 120000) {
			red = 1050;
		}else if (vipHT >= 50000){
			red = 900;
		}else if (vipHT >= 15000){
			red = 750;
		}else if (vipHT >= 6000){
			red = 600;
		}else if (vipHT >= 3000){
			red = 500;
		}else if (vipHT >= 1000){
			red = 425;
		}else if (vipHT >= 500){
			red = 300;
		}else if (vipHT >= 100){
			red = 250;
		}

		var tien = vipHT*red; // Tiền thưởng
		if (tien > 0) {
			client.send(JSON.stringify({profile:{level: {level: 1, vipNext: 100, vipPre: 0, vipTL: user.vip+vipHT, vipHT: 0}}, notice:{text: "Bạn nhận được " + helper.numberWithCommas(tien) + " RED", title: "THÀNH CÔNG"}, user:{red: user.red*1+tien}}));
			UserInfo.findOneAndUpdate({id: client.UID}, {$set:{lastVip: user.redPlay}, $inc: {red: tien, vip: vipHT}}, function(err,cat){});
		}else{
			client.send(JSON.stringify({notice:{text: "Bạn chưa đủ cấp VIP để đổi thưởng...", title: "THẤT BẠI"}}));
		}
	});
}