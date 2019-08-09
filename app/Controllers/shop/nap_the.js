
const tab_NapThe = require('../../Models/NapThe');
const NhaMang    = require('../../Models/NhaMang');
const MenhGia    = require('../../Models/MenhGia');

const UserInfo   = require('../../Models/UserInfo');

const config     = require('../../../config/thecao');

const request    = require('request');

module.exports = function(client, data){
	var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
		checkCaptcha = checkCaptcha.test(client.captcha);
	if (checkCaptcha) {
		var nhaMang = data.nhamang;
		var menhGia = data.menhgia;
		var maThe   = data.mathe.trim();
		var seri    = data.seri.trim();

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
								 	var data = JSON.parse(body);
								 	if (data['error_code'] == '00') {
								 		var nhan = menhGia-(menhGia*config.extract/100);
								 		tab_NapThe.findOneAndUpdate({'_id': cID}, {$set:{nhan:nhan,status:1}}).exec();
								 		UserInfo.findOneAndUpdate({'id': client.UID},    {$inc:{red:nhan}}, function(err2, user) {
								 			client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
								 		});
								 	}else if (data['error_code'] == '18') {
								 		// Chờ kết quả tiếp theo
								 		client.red({loading:{text: 'Đang chờ sử lý...'}});
								 	}else{
								 		tab_NapThe.findOneAndUpdate({'_id': cID}, {$set:{status:2}}).exec();
								 		client.red({notice:{title:'THẤT BẠI', text: config[data['error_code']], load: false}});
								 	}
								});
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
	client.c_captcha('chargeCard');
}
