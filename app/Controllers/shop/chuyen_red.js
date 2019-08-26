
var ChuyenRed = require('../../Models/ChuyenRed');
var UserInfo  = require('../../Models/UserInfo');
var tab_DaiLy = require('../../Models/DaiLy');
var OTP       = require('../../Models/OTP');

var validator = require('validator');
var Helper    = require('../../Helpers/Helpers');

/** OTP
module.exports = function(client, data){
	if (!!data && !!data.name && !!data.otp) {
		if (!validator.isLength(data.name, {min: 3, max: 17})) {
			client.red({notice: {title: "LỖI", text: 'Tên nhân vật không hợp lệ.!'}});
		}else if (!validator.isLength(data.otp, {min: 4, max: 6})) {
			client.red({notice: {title: "LỖI", text: 'Mã OTP không hợp lệ.!'}});
		}else{
			var red  = data.red>>0;
			var name = data.name;
			var otp  = data.otp;

			if(validator.isEmpty(name) ||
				red < 10000 ||
				name.length > 17 ||
				name.length < 3 ||
				otp.length != 4)
			{
				client.red({notice:{title:'CHUYỂN RED', text:'Kiểm tra lại các thông tin.!'}});
			}else{
				OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
					if (data_otp && otp == data_otp.code) {
						if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
							client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
						}else{
							var regex      = new RegExp("^" + name + "$", 'i');
							var regexUsers = new RegExp("^" + client.profile.name + "$", 'i');

							var active1 = tab_DaiLy.findOne({$or:[
								{nickname: {$regex: regex}},
								{nickname: {$regex: regexUsers}}
							]}).exec();

							var active2 = UserInfo.findOne({name: {$regex: regex}}, 'id name red').exec();
							var active3 = UserInfo.findOne({id: client.UID}, 'red').exec();
							Promise.all([active1, active2, active3])
							.then(valuesCheck => {
								var daily = valuesCheck[0];
								var to    = valuesCheck[1];
								var user  = valuesCheck[2];
								if (!!to) {
									if (to.id == client.UID) {
										client.red({notice:{title:'CHUYỂN RED',text:'Bạn không thể chuyển cho chính mình.!!'}});
									}else{
										if (user == null || (user.red-10000 < red)) {
											client.red({notice:{title:'CHUYỂN RED',text:'Số dư không khả dụng.!!'}});
										}else{
											UserInfo.updateOne({id: client.UID}, {$inc:{red:-red}}).exec();
											client.red({notice:{title:'CHUYỂN RED', text: 'Giao dịch thành công.!!'}, user:{red:user.red-red}});
											var thanhTien = !!daily ? red : Helper.anPhanTram(red, 1, 2);
											var create = {'from':client.profile.name, 'to':to.name, 'red':red, 'red_c':thanhTien, 'time': new Date()};
											if (void 0 !== data.message && !validator.isEmpty(data.message.trim())) {
												create = Object.assign(create, {message: data.message});
											}
											ChuyenRed.create(create);
											UserInfo.updateOne({name: to.name}, {$inc:{red:thanhTien}}).exec();
											if (void 0 !== client.redT.users[to.id]) {
												Promise.all(client.redT.users[to.id].map(function(obj){
													obj.red({notice:{title:'CHUYỂN RED', text:'Bạn nhận được ' + Helper.numberWithCommas(thanhTien) + ' Red.' + "\n" + 'Từ người chơi: ' + client.profile.name}, user:{red: to.red*1+thanhTien}});
												}));
											}
											OTP.updateOne({'_id': data_otp._id.toString()}, {$set:{'active':true}}).exec();
										}
									}
								}else{
									client.red({notice:{title:'CHUYỂN RED',text:'Người dùng không tồn tại.!!'}});
								}
							})
						}
					}else{
						client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!'}});
					}
				});
			}
		}
	}
}
*/

module.exports = function(client, data){
	if (!!data && !!data.name) {
		if (!validator.isLength(data.name, {min: 3, max: 17})) {
			client.red({notice: {title: "LỖI", text: 'Tên nhân vật không hợp lệ.!'}});
		}else{
			var red  = data.red>>0;
			var name = data.name;

			if(validator.isEmpty(name) ||
				red < 10000 ||
				name.length > 17 ||
				name.length < 3)
			{
				client.red({notice:{title:'CHUYỂN RED', text:'Kiểm tra lại các thông tin.!'}});
			} else if (!!data.message && !validator.isLength(data.message, {min: 1, max: 250})) {
				client.red({notice:{title:'CHUYỂN RED', text:'Lời nhắn vượt quá 250 kí tự.!'}});
			}else{
				var regex      = new RegExp("^" + name + "$", 'i');
				var regexUsers = new RegExp("^" + client.profile.name + "$", 'i');

				var active1 = tab_DaiLy.findOne({$or:[
					{nickname: {$regex: regex}},
					{nickname: {$regex: regexUsers}}
				]}).exec();

				var active2 = UserInfo.findOne({name: {$regex: regex}}, 'id name red').exec();
				var active3 = UserInfo.findOne({id: client.UID}, 'red').exec();
				Promise.all([active1, active2, active3])
				.then(valuesCheck => {
					var daily = valuesCheck[0];
					var to    = valuesCheck[1];
					var user  = valuesCheck[2];
					if (!!to) {
						if (to.id == client.UID) {
							client.red({notice:{title:'CHUYỂN RED',text:'Bạn không thể chuyển cho chính mình.!!'}});
						}else{
							if (user == null || (user.red-10000 < red)) {
								client.red({notice:{title:'CHUYỂN RED',text:'Số dư không khả dụng.!!'}});
							}else{
								UserInfo.updateOne({id: client.UID}, {$inc:{red:-red}}).exec();
								client.red({notice:{title:'CHUYỂN RED', text: 'Giao dịch thành công.!!'}, user:{red:user.red-red}});
								var thanhTien = !!daily ? red : Helper.anPhanTram(red, 1, 2);
								var create = {'from':client.profile.name, 'to':to.name, 'red':red, 'red_c':thanhTien, 'time': new Date()};
								if (!!data.message && !validator.isEmpty(data.message)) {
									create = Object.assign(create, {message: data.message});
								}
								ChuyenRed.create(create);
								UserInfo.updateOne({'_id': to._id}, {$inc:{red:thanhTien}}).exec();
								if (void 0 !== client.redT.users[to.id]) {
									Promise.all(client.redT.users[to.id].map(function(obj){
										obj.red({notice:{title:'NHẬN RED', text:'Bạn nhận được ' + Helper.numberWithCommas(thanhTien) + ' RED.' + "\n" + 'Từ người chơi: ' + client.profile.name}, user:{red: to.red*1+thanhTien}});
									}));
								}
							}
						}
					}else{
						client.red({notice:{title:'CHUYỂN RED',text:'Người dùng không tồn tại.!!'}});
					}
				});
			}
		}
	}
}
