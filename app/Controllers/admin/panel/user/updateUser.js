
var Users     = require('../../../../Models/Users');
var UserInfo  = require('../../../../Models/UserInfo');
var Phone     = require('../../../../Models/Phone');

var get_info  = require('./get_info');
var validator = require('validator');

var Helper    = require('../../../../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data && !!data.id && !!data.data) {
		var uData = data.data;
		var update = {};
		var password = null;
		if (!!uData.email && Helper.validateEmail(uData.email)) {
			update['email'] = uData.email;
		}
		if (!!uData.cmt && validator.isLength(uData.cmt, {min:9, max: 12})) {
			update['cmt'] = uData.cmt;
		}
		if (!!uData.red && !validator.isEmpty(uData.red)) {
			update['red'] = Helper.getOnlyNumberInString(uData.red);
		}
		if (!!uData.type && uData.type != '0') {
			update['type'] = uData.type == '1' ? true : false;
		}
		UserInfo.findOne({'id':data.id}, function(err, check) {
			if (check) {
				client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
				if (!!Object.entries(update).length) {
					UserInfo.updateOne({'id':data.id}, {$set:update}).exec();
				}
				if (!!uData.phone && Helper.checkPhoneValid(uData.phone)) {
					let phoneCrack = Helper.phoneCrack(uData.phone);
					if (phoneCrack) {
						if (phoneCrack.region == '0' || phoneCrack.region == '84') {
							phoneCrack.region = '+84';
						}
						Phone.findOne({'phone':phoneCrack.phone}, function(err3, crack){
							if (!crack) {
								Phone.findOne({'uid':check.id}, function(err4, checkP){
									if (checkP) {
										checkP.phone = phoneCrack.phone;
										checkP.region = phoneCrack.region;
										checkP.save();
									}else{
										Phone.create({'uid':check.id, 'phone':phoneCrack.phone, 'region':phoneCrack.region});
									}
								});
							}
						});
					}
				}
				get_info(client, data.id);
			}else{
				client.red({notice:{title:'NGƯỜI DÙNG', text:'Người dùng không tồn tại...'}});
			}
		});
		if (!!uData.pass && validator.isLength(uData.pass, {min:6, max: 32})) {
			password = Helper.generateHash(uData.pass);
			Users.updateOne({'_id': data.id}, {$set:{'local.password':password}}).exec();
			client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
		}
	}
}
