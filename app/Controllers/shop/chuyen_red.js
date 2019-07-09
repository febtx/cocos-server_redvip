
const ChuyenRed = require('../../Models/ChuyenRed');
const UserInfo  = require('../../Models/UserInfo');
const tab_DaiLy = require('../../Models/DaiLy');

const Helper    = require('../../Helpers/Helpers');

module.exports = function(client, data){
	var red  = data.red>>0;
	//var otp       = data.otp;

	if (void 0 == data.name || typeof data.name != "string") {
		client.send(JSON.stringify({notice:{title:'CHUYỂN RED',text:'Thông tin không đúng.!!'}}));
	}else{
		if (red < 10000) {
			client.send(JSON.stringify({notice:{title:'CHUYỂN RED',text:'Số tiền chuyển tối thiểu là 10.000 RED'}}));
		}else{
			var regex = new RegExp("^" + data.name + "$", 'i');
			var active1 = tab_DaiLy.findOne({nickname: {$regex: regex}}).exec();
			var active2 = UserInfo.findOne({name: {$regex: regex}}, 'id name').exec();
			var active3 = UserInfo.findOne({id: client.UID}, 'red').exec();
			Promise.all([active1, active2, active3])
			.then(valuesCheck => {
				var daily = valuesCheck[0];
				var to    = valuesCheck[1];
				var user  = valuesCheck[2];
				if (!!to) {
					if (to.id == client.UID) {
						client.send(JSON.stringify({notice:{title:'CHUYỂN RED',text:'Bạn không thể chuyển cho chính mình.!!'}}));
					}else{
						if (user == null || (user.red-10000 < red)) {
							client.send(JSON.stringify({notice:{title:'CHUYỂN RED',text:'Số dư không khả dụng.!!'}}));
						}else{
							UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-red}}, function(err,cat){
								client.send(JSON.stringify({notice:{title:'CHUYỂN RED', text: 'Giao dịch thành công.!!'}, user:{red:cat.red-red}}));
							});
							console.log(daily);
							var chiet_khau = !!daily ? 0 : Math.floor(red*2/100);
							var thanhTien = !!daily ? red : Helper.anPhanTram(red, 1, 2);
							var create = {'from':client.profile.name, 'to':to.name, 'red':red, 'red_c':thanhTien, 'time': new Date()};
							if (void 0 !== data.message && !Helper.isEmpty(data.message.trim())) {
								create = Object.assign(create, {message: data.message});
							}
							ChuyenRed.create(create);
							UserInfo.findOneAndUpdate({name: {$regex: regex}}, {$inc:{red:thanhTien}}, function(err,cat){
								if (void 0 !== client.redT.users[cat.id]) {
									Promise.all(client.redT.users[cat.id].map(function(obj){
										obj.send(JSON.stringify({notice:{title:'CHUYỂN RED', text:'Bạn nhận được ' + Helper.numberWithCommas(thanhTien) + ' Red.' + "\n" + 'Từ người chơi: ' + client.profile.name}, user:{red: cat.red+thanhTien}}));
									}));
								}
							});
						}
					}
				}else{
					client.send(JSON.stringify({notice:{title:'CHUYỂN RED',text:'Người dùng không tồn tại.!!'}}));
				}
			})
		}
	}
}
