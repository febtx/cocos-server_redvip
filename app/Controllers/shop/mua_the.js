
const MuaThe        = require('../../Models/MuaThe');
const MuaThe_thenap = require('../../Models/MuaThe_card');
const UserInfo      = require('../../Models/UserInfo');

const NhaMang       = require('../../Models/NhaMang');
const MenhGia       = require('../../Models/MenhGia');

const OTP           = require('../../Models/OTP');

var helper          = require('../../Helpers/Helpers');

/** OTP
module.exports = function(client, data){
	var nhaMang = data.nhamang;
	var menhGia = data.menhgia;
	var soluong = data.soluong>>0;
	var otp     = data.otp;

	if (helper.isEmpty(nhaMang) ||
		helper.isEmpty(menhGia) ||
		otp.length != 4 ||
		soluong < 1 ||
		soluong > 3
		)
	{
		client.red({notice:{title:'LỖI', text:'Bạn nhập không đúng thông tin.!'}});
	}else{
		OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
			if (data_otp && otp == data_otp.code) {
				if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
					client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
				}else{
					var check1 = NhaMang.findOne({name: nhaMang, mua: true}).exec();
					var check2 = MenhGia.findOne({name: menhGia, mua: true}).exec();

					Promise.all([check1, check2])
					.then(values => {
						if (!!values[0] && !!values[1] && soluong > 0 && soluong < 4) {
							var totall = values[1].values*soluong;
							UserInfo.findOne({id: client.UID}, 'red name', function(err, check){
								if (check == null || check.red <= totall) {
									client.send(JSON.stringify({notice:{title:'MUA THẺ',text:'Số dư không khả dụng.!!'}}));
								}else{
									OTP.findOneAndUpdate({'_id': data_otp._id.toString()}, {$set:{'active':true}}, function(err, cat){});
									UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-totall}}, function(err, user){
										client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Yêu cầu mua thẻ thành công.!!'}, user:{red: user.red-totall}}));
									});
									MuaThe.create({'uid': client.UID, 'nhaMang':nhaMang, 'menhGia':menhGia, 'soLuong':soluong, 'Cost':totall, 'time': new Date()},
										function (err, dataW) {
						  					if (!!dataW) {
												var cID = dataW._id.toString();
												while(soluong > 0){
													MuaThe_thenap.create({'cart':cID, 'nhaMang':nhaMang, 'menhGia':menhGia});
													soluong--;
												}
						  					}
										}
									);
								}
							});
						}else{
							client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Thông tin không đúng.!!'}}));
						}
					})
				}
			}else{
				client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!'}});
			}
		});
	}
}
*/


module.exports = function(client, data){
	var nhaMang = data.nhamang;
	var menhGia = data.menhgia;
	var soluong = data.soluong>>0;

	if (helper.isEmpty(nhaMang) ||
		helper.isEmpty(menhGia) ||
		soluong < 1 ||
		soluong > 3
		)
	{
		client.red({notice:{title:'LỖI', text:'Bạn nhập không đúng thông tin.!'}});
	}else{
		var check1 = NhaMang.findOne({name: nhaMang, mua: true}).exec();
		var check2 = MenhGia.findOne({name: menhGia, mua: true}).exec();

		Promise.all([check1, check2])
		.then(values => {
			if (!!values[0] && !!values[1] && soluong > 0 && soluong < 4) {
				var totall = values[1].values*soluong;
				UserInfo.findOne({id: client.UID}, 'red name', function(err, check){
					if (check == null || check.red <= totall) {
						client.send(JSON.stringify({notice:{title:'MUA THẺ',text:'Số dư không khả dụng.!!'}}));
					}else{
						UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-totall}}, function(err, user){
							client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Yêu cầu mua thẻ thành công.!!'}, user:{red: user.red-totall}}));
						});
						MuaThe.create({'uid': client.UID, 'nhaMang':nhaMang, 'menhGia':menhGia, 'soLuong':soluong, 'Cost':totall, 'time': new Date()},
							function (err, dataW) {
			  					if (!!dataW) {
									var cID = dataW._id.toString();
									while(soluong > 0){
										MuaThe_thenap.create({'cart':cID, 'nhaMang':nhaMang, 'menhGia':menhGia});
										soluong--;
									}
			  					}
							}
						);
					}
				});
			}else{
				client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Thông tin không đúng.!!'}}));
			}
		});
	}
}
