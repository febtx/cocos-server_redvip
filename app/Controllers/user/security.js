
var UserInfo  = require('../../Models/UserInfo');
var Phone     = require('../../Models/Phone');

var helper    = require('../../Helpers/Helpers');
function regPhone(client, phone){
	phone = ''+phone+'';
	if(!helper.checkPhoneValid(phone)) {
		client.red({notice:{title:'LỖI', text:'Số điện thoại không hợp lệ.'}});
	}else{
		let phoneCrack = helper.phoneCrack(phone);
		if (phoneCrack){
			if (phoneCrack.region == '0' || phoneCrack.region == '84') {
				phoneCrack.region = '+84';
			}
			Phone.findOne({'phone':phoneCrack.phone}, function(err3, crack){
				if (crack) {
					client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
				}else{
					Phone.findOne({'uid':client.UID}, function(err4, check){
						if (check) {
							client.red({user:{phone:helper.cutPhone(check.region+check.phone)}});
						}else{
							try {
								Phone.create({'uid':client.UID, 'phone':phoneCrack.phone, 'region':phoneCrack.region}, function(err, cP){
									if (!!cP) {
										client.red({user:{phone:helper.cutPhone(phone)}});
									}else{
										client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
									}
								});
							} catch (error) {
								client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
							}
						}
					});
				}
			});
		}else{
			client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
		}
	}
}

module.exports = function(client, data) {
	if (!!data.regPhone) {
		regPhone(client, data.regPhone);
	}
}
