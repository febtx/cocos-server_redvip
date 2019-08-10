
var User     = require('../../Models/Users');
var UserInfo = require('../../Models/UserInfo');
var OTP      = require('../../Models/OTP');

var validator = require('validator');
var Helper    = require('../../Helpers/Helpers');
var smsOTP    = require('../../sms').sendOTP;

function sendOTP(client, name){
	if (!!name) {
		var az09     = new RegExp("^[a-zA-Z0-9]+$");
		var testName = az09.test(name);
		if (!validator.isLength(name, {min: 3, max: 32}) || !testName) {
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
							if (validator.isEmpty(user.phone)) {
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
}

function iForGot(client, data){
	if (!!data && !!data.name && !!data.pass && !!data.otp && !!data.captcha) {
		if (!validator.isLength(data.name, {min: 3, max: 32}) ||
			!validator.isLength(data.pass, {min: 6, max: 32}) ||
			!validator.isLength(data.otp, {min: 4, max: 6})   ||
			!validator.isLength(data.captcha, {min: 4, max: 4}))
		{
			client.red({notice: {title: "LỖI", text: "Thông tin không đúng..."}});
		}else{
			var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
				checkCaptcha = checkCaptcha.test(client.captcha);
			if (checkCaptcha) {
				var regex = new RegExp("^" + data.name + "$", 'i');
				User.findOne({'local.username': {$regex: regex}}).exec(function(err, check){
					if (!!check) {
						if (check['local']['ban_pass'] > 3) {
							client.red({notice: {title: "LỖI", text: "Tài khoản này bị khóa lấy lại mật khẩu, liên hệ admin để được trợ giúp..."}});
						}else{
							var cID = check._id.toString();
							UserInfo.findOne({'id': cID}, 'phone').exec(function(err, user){
								if (!!user) {
									if (validator.isEmpty(user.phone)) {
										client.red({notice: {title: "LỖI", text: "Tài khoản này chưa xác thực..."}});
									}else{
										OTP.findOne({'uid': cID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
											if (!!data_otp && data.otp == data_otp.code) {
												if ((new Date()-Date.parse(data_otp.date))/1000 > 180 || data_otp.active) {
													client.red({notice:{title:'OTP', text:'Mã OTP đã hết hạn.!'}});
												}else{
													OTP.findOneAndUpdate({'_id': data_otp._id.toString()}, {$set:{'active':true}}, function(err, cat){});
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
						}
					}else{
						client.red({notice: {title: "LỖI", text: "Tên tài khoản không tồn tại..."}});
					}
				});
			}else{
				client.red({notice:{title:'LỖI', text:'Captcha không đúng'}});
			}
		}
		client.c_captcha('forgotpass');
	}
}
module.exports = function(client, data){
	if(!!data) {
		if (!!data.sendOTP) {
			sendOTP(client, data.sendOTP);
		}
		if (!!data.iforgot) {
			iForGot(client, data.iforgot);
		}
	}
}
