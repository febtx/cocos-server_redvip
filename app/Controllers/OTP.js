
var UserInfo = require('../Models/UserInfo');
var OTP      = require('../Models/OTP');

var helper     = require('../Helpers/Helpers');
var mailOTP    = require('../mail').sendOTP;
var smsOTP     = require('../sms').sendOTP;

function createOTP(client, type){
	type = type>>0;
	OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data){
		if (!data || ((new Date()-Date.parse(data.date))/1000) > 180 || data.active) {
			// Tạo mã OTP mới
			UserInfo.findOne({'id': client.UID}, 'phone email red', function(err, user){
				if (user) {
					if (!helper.isEmpty(user.phone)) {
						var otp = (Math.random()*(9999-1000+1)+1000)>>0; // OTP từ 1000 đến 9999
						if (type == '1') {
							// Lấy Email OTP
							mailOTP(user.email, otp);
							OTP.create({'uid': client.UID, 'code': otp, 'date': new Date()});
							client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới email của bạn.'}});
						} else if (type == '2') {
							// SMS OTP
							if (user.red < 1000) {
								// Red không đủ để lấy OTP
								client.red({notice:{title:'THẤT BẠI', text:'Số dư trong tài khoản không đủ để lấy OTP.'}});
							}else{
								// Lấy SMS OTP

								user.red -= 1000;
								user.save();

								smsOTP(user.phone, otp);

								OTP.create({'uid': client.UID, 'code': otp, 'date': new Date()});
								client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới số điện thoại của bạn.'}, user:{red:user.red-1000}});
							}
						}
					}else{
						client.red({notice:{title:'THÔNG BÁO', text:'Bạn cần kích hoạt số điện thoại để sử dụng chức năng này.', button: {text: 'KÍCH HOẠT', type: 'reg_otp'}}});
					}
				}
			});
		}else{
			client.red({notice:{title:'OTP', text:'Vui lòng kiểm tra hòm thư đến.!'}});
		}
	});
}

module.exports = function(client, data){
	if (!!data.type){
		createOTP(client, data.type);
	}
}
