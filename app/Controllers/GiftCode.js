
const UserInfo = require('../Models/UserInfo');
const GiftCode = require('../Models/GiftCode');
const Helpers  = require('../Helpers/Helpers');

const captcha = require('../../captcha');

module.exports = function(client, data){
	if (void 0 === data.code || data.code.trim().length < 4) {
		client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'GiftCode không tồn tại.'}}));
		captcha(client, 'giftcode');
	}else if (void 0 === client.captcha.giftcode || void 0 === data.captcha || data.captcha.trim() < 4) {
		client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Captcha không tồn tại.'}}));
		captcha(client, 'giftcode');
	}else{
		var checkCaptcha = data.captcha.trim();
			checkCaptcha = new RegExp("^" + checkCaptcha + "$", 'i').test(client.captcha.giftcode);
		if (checkCaptcha) {
			var code = data.code.trim();
			    code = new RegExp("^" + code + "$", 'i');
			GiftCode.findOne({'code': {$regex: code}}, {}, function(err, check) {
				if (!!check) {
					var d1 = Date.parse(new Date());
					var d2 = Date.parse(check.todate);
					if (d2 > d1) {
						if (void 0 !== check.uid) {
							captcha(client, 'giftcode');
							client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Mã Gift Code đã qua sử dụng.' + "\n" + ' Hãy thử một mã khác...'}}));
						}else{
							if (Helpers.isEmpty(check.type)) {
								GiftCode.findOneAndUpdate({'_id': check._id}, {$set:{uid: client.UID}}).exec();
								UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:check.red, xu:check.xu}}).exec(function(err, user){
									captcha(client, 'giftcode');
									client.send(JSON.stringify({notice:{title:'THÀNH CÔNG',text:'Bạn nhận được: ' + (check.red > 0 ? Helpers.numberWithCommas(check.red) + ' RED' : '') + (check.xu > 0 ? (check.red > 0 ? ' và ' : '') + Helpers.numberWithCommas(check.xu) + ' XU' : '')}, user:{red:user.red*1+check.red, xu:user.xu*1+check.xu}}));
								});
							}else{
								GiftCode.findOne({'uid': client.UID, 'type': check.type}, 'code', function(err, check2) {
									if (!!check2) {
										captcha(client, 'giftcode');
										client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Bạn đã từng sử dụng họ Gift Code này trước đây...!!'}}));
									}else{
										captcha(client, 'giftcode');
										GiftCode.findOneAndUpdate({'_id': check._id}, {$set:{uid: client.UID}}).exec();
										UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:check.red, xu:check.xu}}).exec(function(err, user){
											client.send(JSON.stringify({notice:{title:'THÀNH CÔNG',text:'Bạn nhận được: ' + (check.red > 0 ? Helpers.numberWithCommas(check.red) + ' RED' : '') + (check.xu > 0 ? (check.red > 0 ? ' và ' : '') + Helpers.numberWithCommas(check.xu) + ' XU' : '')}, user:{red:user.red*1+check.red, xu:user.xu*1+check.xu}}));
										});
									}
								})
							}
						}
					}else{
						captcha(client, 'giftcode');
						client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Mã Gift Code Đã hết hạn...!!'}}));
					}
				}else{
					captcha(client, 'giftcode');
					client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Mã Gift Code không tồn tại...!!'}}));
				}
			});
		}else{
			captcha(client, 'giftcode');
			client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Captcha không đúng.'}}));
		}
	}
}
