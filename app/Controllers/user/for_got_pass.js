
const User     = require('../../Models/Users');
const UserInfo = require('../../Models/UserInfo');
const OTP      = require('../../Models/OTP');

const Helper   = require('../../Helpers/Helpers');
var smsOTP     = require('../../sms').sendOTP;


function sendOTP(client, name){
	name = name.trim();
	if (name.length < 3 || name.length > 32) {
		client.red({notice: {title: "LỖI", text: "Vui lòng nhập chính xác tên tài khoản..."}});
	}else{
		var regex = new RegExp("^" + name + "$", 'i');
		User.findOne({'local.username': {$regex: regex}}).exec(function(err, check){
			if (!!check) {
				//local.ban_pass
				if (check['local']['ban_pass'] > 3) {
					client.red({notice: {title: "LỖI", text: "Bạn đã đạt giới hạn lấy mã OTP, liên hệ Admin để được trợ giúp..."}});
					return void 0;
				}
				var cID = check._id.toString();
				UserInfo.findOne({'id': cID}, 'phone red').exec(function(err, user){
					if (!!user) {
						if (Helper.isEmpty(user.phone)) {
							client.red({notice: {title: "LỖI", text: "Tài khoản này chưa xác thực..."}});
						}else{
							if (user.red < 1000) {
								// Red không đủ để lấy OTP
								client.red({notice:{title:'THẤT BẠI', text:'Không thể lấy mã OTP vui lòng liên hệ admin.'}});
							}else{
								OTP.findOne({'uid': cID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
									if (!data_otp || (new Date()-Date.parse(data_otp.date))/1000 > 180 || data_otp.active) {
										var otp = (Math.random()*(9999-1000+1)+1000)>>0; // OTP từ 1000 đến 9999
										// Lấy SMS OTP
										smsOTP(user.phone, otp);
										OTP.create({'uid': cID, 'code': otp, 'date': new Date()});
										User.findOneAndUpdate({'_id': cID}, {$inc:{'local.ban_pass':1}}, function(err, cat){});
										UserInfo.findOneAndUpdate({'id': cID}, {$inc:{red:-1000}}, function(err, cat){});
										client.red({notice: {title: "THÔNG BÁO", text: "Mã OTP đã được gửi vào số điện thoại của bạn..."}});
									}else{
										client.red({notice:{title:'OTP', text:'Vui lòng kiểm tra hòm thư đến.!'}});
									}
								});
							}
						}
					}else{
						client.red({notice: {title: "LỖI", text: "Tài khoản này chưa tạo nhân vật..."}});
					}
				});
			}else{
				client.red({notice: {title: "LỖI", text: "Tên tài khoản không tồn tại..."}});
			}
		});
	}
}

function iForGot(client, data){
	if(!Helper.isEmpty(data.name) &&
		!Helper.isEmpty(data.pass) &&
		!Helper.isEmpty(data.otp) &&
		!Helper.isEmpty(data.captcha))
	{
		var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
			checkCaptcha = checkCaptcha.test(client.captcha);
		if (checkCaptcha) {
			if(void 0 == data.name.length || (void 0 !== data.name.length && (data.name.length < 3 || data.name.length > 32))){
				client.red({notice: {title: "LỖI", text: "Tài khoản không hợp lệ..."}});
				return void 0;
			}
			if(void 0 == data.pass.length || (void 0 !== data.pass.length && (data.pass.length < 6 || data.pass.length > 32))){
				client.red({notice: {title: "LỖI", text: "Mật khẩu không hợp lệ..."}});
				return void 0;
			}
			var regex = new RegExp("^" + data.name + "$", 'i');
			User.findOne({'local.username': {$regex: regex}}).exec(function(err, check){
				if (!!check) {
					if (check['local']['ban_pass'] > 3) {
						client.red({notice: {title: "LỖI", text: "Tài khoản này bị khóa lấy lại mật khẩu, liên hệ admin để được trợ giúp..."}});
						return void 0;
					}
					var cID = check._id.toString();
					UserInfo.findOne({'id': cID}, 'phone').exec(function(err, user){
						if (!!user) {
							if (Helper.isEmpty(user.phone)) {
								client.red({notice: {title: "LỖI", text: "Tài khoản này chưa xác thực..."}});
							}else{
								OTP.findOne({'uid': cID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
									if (data_otp && data.otp == data_otp.code) {
										if ((new Date()-Date.parse(data_otp.date))/1000 > 180 || data_otp.active) {
											client.red({notice:{title:'OTP', text:'Mã OTP đã hết hạn.!'}});
										}else{
											OTP.findOneAndUpdate({'_id': data_otp._id}, {$set:{'active':true}}, function(err, cat){});
											User.findOneAndUpdate({'_id': cID}, {$set:{'local.ban_pass':0, 'local.password': Helper.generateHash(data.pass)}}, function(err, cat){});
											client.red({notice: {title: "THÀNH CÔNG", text: "Bạn vừa lấy lại mật khẩu thành công."}});
										}
									}else{
										client.red({notice: {title: "LỖI", text: "Mã OTP không đúng..."}});
									}
								});
							}
						}else{
							client.red({notice: {title: "LỖI", text: "Tài khoản này chưa tạo nhân vật..."}});
						}
					});
				}else{
					client.red({notice: {title: "LỖI", text: "Tên tài khoản không tồn tại..."}});
				}
			});
		}else{
			client.red({notice:{title:'LỖI', text:'Captcha không đúng'}});
		}
	}else{
		client.red({notice:{title:'LỖI', text:'Không xác định'}});
	}
	client.c_captcha('forgotpass');
}
module.exports = function(client, data){
	if (void 0 !== data.sendOTP) {
		sendOTP(client, data.sendOTP);
	}
	if (void 0 !== data.iforgot) {
		iForGot(client, data.iforgot);
	}
}
