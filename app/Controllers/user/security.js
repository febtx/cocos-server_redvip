

const UserInfo = require('../../Models/UserInfo');
const OTP      = require('../../Models/OTP');

var helper     = require('../../Helpers/Helpers');
var sms        = require('../../sms').sendOTP;

function sendOTP(client, phone){
	// Mã OTP được gửi tới phone của bạn...
	var otp = (Math.random()*(9999-1000+1)+1000)>>0; // từ 1000 đến 9999
	if (helper.checkPhoneValid(phone)) {
		OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data){
			if (!data || (new Date()-Date.parse(data.date))/1000 > 180 || data.active) {
				UserInfo.findOne({'id': client.UID}, 'phone email cmt', function(err, dU){
					if (dU) {
						if (helper.isEmpty(dU.phone)){
							UserInfo.findOne({'phone': phone}, 'id', function(err, check){
								if (check) {
									client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
								}else{
									sms(phone, otp);
									OTP.create({'uid': client.UID, 'code': otp, 'date': new Date()});
									client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới số điện thoại của bạn.'}});
								}
							});
						}else{
							client.red({notice:{title:'LỖI', text:'Bạn đã kích hoạt OTP.!'}, user:{phone: helper.cutPhone(dU.phone), email: helper.cutEmail(dU.email), cmt: dU.cmt}});
						}
					}
				});
			}else{
				client.red({notice:{title:'OTP', text:'Vui lòng kiểm tra hòm thư đến.!'}});
			}
		});
	}else{
		client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
	}
}

function regOTP(client, data){
	if (!helper.checkPhoneValid(data.phone) ||
		!helper.validateEmail(data.email) ||
		helper.isEmpty(data.cmt) ||
		helper.isEmpty(data.otp) ||
		data.otp.length != 4 ||
		data.cmt.length < 9 ||
		data.cmt.length > 12
		)
	{
		client.red({notice:{title:'LỖI', text:'Bạn nhập không đúng thông tin.!'}});
	}else{
		OTP.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, data_otp){
			if (data_otp && data.otp == data_otp.code) {
				if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
					client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
				}else{
					UserInfo.findOne({'id': client.UID}, 'phone email cmt', function(err, dU){
						if (dU) {
							if (helper.isEmpty(dU.phone)){
								UserInfo.findOne({'phone': data.phone}, 'id', function(err, check){
									if (check) {
										client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
									}else{
										// Xác thực thành công
										OTP.findOneAndUpdate({'_id': data_otp._id}, {$set:{'active':true}}, function(err, cat){});
										UserInfo.findOneAndUpdate({id:client.UID},{$set:{phone:data.phone, email:data.email, cmt:data.cmt}, $inc:{red:3000, xu:10000}}, function(err, user){
											client.red({notice:{title:'THÀNH CÔNG', text: 'Xác thực thành công.!' + "\n" + 'Bạn nhận được 3.000Red vào 10.000Xu, chúc bạn vui vẻ...'}, user: {red: user.red*1+3000, xu: user.xu*1+10000, phone: helper.cutPhone(data.phone), email: helper.cutEmail(data.email), cmt: data.cmt}});
										});
									}
								});
							}else{
								client.red({notice:{title:'LỖI', text:'Bạn đã kích hoạt OTP.!'}, user:{phone: helper.cutPhone(dU.phone), email: helper.cutEmail(dU.email), cmt: dU.cmt}});
							}
						}
					});
				}
			}else{
				client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!'}});
			}
		});
	}
}

module.exports = function(client, data) {
	if (void 0 !== data.sendOTP) {
		sendOTP(client, data.sendOTP);
	}
	if (void 0 !== data.regOTP) {
		regOTP(client, data.regOTP);
	}
}
