
var tab_NapThe = require('../../Models/NapThe');
var NhaMang    = require('../../Models/NhaMang');
var MenhGia    = require('../../Models/MenhGia');

var UserInfo   = require('../../Models/UserInfo');

var config     = require('../../../config/thecao');
var request    = require('request');
var validator  = require('validator');

module.exports = function(client, data){
	if (!!data && !!data.nhamang && !!data.menhgia && !!data.mathe && !!data.seri && !!data.captcha) {
		if (!validator.isLength(data.captcha, {min: 4, max: 4})) {
			client.red({notice:{title:'LỖI', text:'Captcha không đúng', load: false}});
		}else if(validator.isEmpty(data.nhamang)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn nhà mạng...', load: false}});
		}else if(validator.isEmpty(data.menhgia)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn mệnh giá thẻ...', load: false}});
		}else if(validator.isEmpty(data.mathe)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập mã thẻ cào...', load: false}});
		}else if(validator.isEmpty(data.seri)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập seri ...', load: false}});
		}else{
			var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
				checkCaptcha = checkCaptcha.test(client.captcha);
			if (checkCaptcha) {
				var nhaMang = data.nhamang;
				var menhGia = data.menhgia;
				var maThe   = data.mathe;
				var seri    = data.seri;

				var check1 = NhaMang.findOne({name: nhaMang, nap: true}).exec();
				var check2 = MenhGia.findOne({name: menhGia, nap: true}).exec();

				Promise.all([check1, check2])
				.then(values => {
					if (!!values[0] && !!values[1] && maThe.length > 11 && seri.length > 11) {

						var nhaMang_data = values[0];
						var menhGia_data = values[1];

						tab_NapThe.findOne({'uid':client.UID, 'nhaMang':nhaMang, 'menhGia':menhGia, 'maThe':maThe, 'seri':seri}, function(err, cart){
							if (cart !== null) {
								client.red({notice:{title:'THẤT BẠI', text:'Bạn đã yêu cầu nạp thẻ này trước đây.!!', load: false}});
							}else{
								tab_NapThe.create({'uid':client.UID, 'nhaMang':nhaMang, 'menhGia':menhGia, 'maThe':maThe, 'seri':seri, 'time': new Date()}, function(error, create){
									if (!!create) {
										client.red({notice:{title:'THÔNG BÁO', text:'Yêu cầu nạp thẻ thành công.!!', load: false}});

										/**
										var cID = create._id.toString();
										request.post({
											url: config.URL,
											form: {
												merchant_id:       config.APP_ID,
												merchant_password: config.APP_PASSWORD,
												pin_card:        maThe,
												card_serial:     seri,
												type_card:       nhaMang_data.value,
												card_price:      menhGia,
												ref_code:        cID,
												client_fullname: '',
												client_email:    '',
												client_mobile:   '',
											}
										},
										function(err, httpResponse, body){
											try {
												var data = JSON.parse(body);
												if (data['error_code'] == '00') {
													var nhan = menhGia-(menhGia*config.extract/100);
													tab_NapThe.updateOne({'_id': cID}, {$set:{nhan:nhan, status:1}}).exec();
													UserInfo.findOneAndUpdate({'id': client.UID}, {$inc:{red:nhan}}, function(err2, user) {
														client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
													});
												}else if (data['error_code'] == '18') {
													// Chờ kết quả tiếp theo
													client.red({loading:{text: 'Đang chờ sử lý...'}});
												}else{
													tab_NapThe.updateOne({'_id': cID}, {$set:{status:2}}).exec();
													client.red({notice:{title:'THẤT BẠI', text: config[data['error_code']], load: false}});
												}
											} catch(e){
												client.red({notice:{title:'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false}});
											}
										});
										*/
									}else{
										client.red({notice:{title:'BẢO TRÌ', text: 'Hệ thống nạp thẻ tạp thời không hoạt động, vui lòng giữ lại thẻ và quay lại sau.', load: false}});
									}
								});
							}
						});
					}else{
						client.red({notice:{title:'THẤT BẠI', text:'Thẻ nạp không được hỗ trợ.!!', load: false}});
					}
				});
			}else{
				client.red({notice:{title:'NẠP THẺ', text:'Captcha không đúng', load: false}});
			}
		}
	}
	client.c_captcha('chargeCard');
}
