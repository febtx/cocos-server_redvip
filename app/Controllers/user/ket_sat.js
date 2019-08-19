
const UserInfo = require('../../Models/UserInfo');
const OTP      = require('../../Models/OTP');

const Helper   = require('../../Helpers/Helpers');

/** OTP
function gui(client, red){
	red = red>>0;
	if (red < 10000) {
		client.red({notice:{title: "GỬI RED", text: "Số tiền gửi phải lớn hơn 10.000"}});
	}else{
		UserInfo.findOne({id: client.UID}, 'red ketSat phone', function(err, user){
			if(Helper.isEmpty(user.phone)){
				client.red({notice:{title: "THÔNG BÁO", text: "Chức năng chỉ dành cho tài khoản đã kích hoạt."}});
				return void 0;
			}
			if (user.red < red) {
				client.red({notice:{title: "THÔNG BÁO", text: "Số dư không khả dụng."}});
			}else{
				UserInfo.updateOne({id: client.UID}, {$inc:{red: -red, ketSat: red}}).exec();
				client.red({notice:{title:'THÀNH CÔNG', text: 'Đã gửi ' + Helper.numberWithCommas(red) + ' RED vào két sắt thành công.!!'}, user:{red:user.red-red, ketSat: user.ketSat*1+red}});
			}
		});
	}
	//return void 0;
}

function rut(client, data){
	var red = data.red>>0;

	if (red < 10000) {
		client.red({notice:{title: "RÚT RED", text: "Số tiền rút phải lớn hơn 10.000"}});
	}else{
		UserInfo.findOne({id: client.UID}, 'red ketSat phone', function(err, user){
			if(Helper.isEmpty(user.phone)){
				client.red({notice:{title: "THÔNG BÁO", text: "Chức năng chỉ dành cho tài khoản đã kích hoạt."}});
				return void 0;
			}
			OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
				if (data_otp && data.otp == data_otp.code) {
					if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
						client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
					}else{
						if (user.ketSat < red) {
							client.red({notice:{title: "THẤT BẠI", text: "Số tiền trong két nhỏ hơn số tiền giao dịch."}});
						}else{
							OTP.updateOne({'_id': data_otp._id.toString()}, {$set:{'active':true}}).exec();
							UserInfo.updateOne({id: client.UID}, {$inc:{red: red, ketSat: -red}}).exec();
							client.red({notice:{title:'THÀNH CÔNG', text: 'Rút thành công ' + Helper.numberWithCommas(red) + ' RED từ két sắt.!!'}, user:{red: user.red*1+red, ketSat: user.ketSat-red}});
						}
					}
				}else{
					client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!'}});
				}
			});
		});
	}
}
*/

function gui(client, red){
	red = red>>0;
	if (red < 10000) {
		client.red({notice:{title: "GỬI RED", text: "Số tiền gửi phải lớn hơn 10.000"}});
	}else{
		UserInfo.findOne({id: client.UID}, 'red ketSat', function(err, user){
			if (user.red < red) {
				client.red({notice:{title: "THÔNG BÁO", text: "Số dư không khả dụng."}});
			}else{
				user.red   -= red;
				user.ketSat = user.ketSat*1 + red;
				user.save();
				client.red({notice:{title:'THÀNH CÔNG', text: 'Đã gửi ' + Helper.numberWithCommas(red) + ' RED vào két sắt thành công.!!'}, user:{red:user.red, ketSat: user.ketSat}});
			}
		});
	}
	//return void 0;
}

function rut(client, data){
	var red = data.red>>0;

	if (red < 10000) {
		client.red({notice:{title: "RÚT RED", text: "Số tiền rút phải lớn hơn 10.000"}});
	}else{
		UserInfo.findOne({id: client.UID}, 'red ketSat', function(err, user){
			if (user.ketSat < red) {
				client.red({notice:{title: "THẤT BẠI", text: "Số tiền trong két nhỏ hơn số tiền giao dịch."}});
			}else{
				user.red     = user.red*1 + red;
				user.ketSat -= red;
				user.save();
				client.red({notice:{title:'THÀNH CÔNG', text: 'Rút thành công ' + Helper.numberWithCommas(red) + ' RED từ két sắt.!!'}, user:{red: user.red, ketSat: user.ketSat}});
			}
		});
	}
}

module.exports = function(client, data) {
	if (void 0 !== data.gui) {
		gui(client, data.gui)
	}
	if (void 0 !== data.rut) {
		rut(client, data.rut)
	}
};
