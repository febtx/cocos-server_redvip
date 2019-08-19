
const tab_NapThe = require('../app/Models/NapThe');
const UserInfo   = require('../app/Models/UserInfo');

const config     = require('../config/thecao');

const Helper     = require('../app/Helpers/Helpers');

const fs = require('fs');

module.exports = function(app, redT) {
	// Sign API

	app.get('/api/callback/prepaid_card', function(req, res) {
		return res.render('callback/prepaid_card');
	});
	app.post('/api/callback/prepaid_card', function(req, res) {
		try {
			var data = req.body;
			if (!!data && !!data.error_code && !!data.ref_code) {
				if (data.error_code == '00') {
					// thành công
					tab_NapThe.findOneAndUpdate({'_id': data.ref_code}, {$set:{status:1}}, function(err, napthe) {
						if (!!napthe && napthe.nhan == 0) {
							var nhan = napthe.menhGia-(napthe.menhGia*config.extract/100);
							UserInfo.findOneAndUpdate({'id': napthe.uid}, {$inc:{red:nhan}}, function(err2, user) {
								if (void 0 !== redT.users[napthe.uid]) {
									Promise.all(redT.users[napthe.uid].map(function(obj){
										obj.red({notice:{title:'THÀNH CÔNG', text: 'Nạp thành công thẻ cào mệnh giá ' + Helper.numberWithCommas(napthe.menhGia), load: false}, user:{red: user.red*1+nhan}});
									}));
								}
							});
							tab_NapThe.updateOne({'_id': data.ref_code}, {$set:{nhan:nhan}}).exec();
						}
					});
				}else{
					// thất bại
					tab_NapThe.findOneAndUpdate({'_id': data.ref_code}, {$set:{status:2}}, function(err, napthe) {
						if (!!napthe) {
							if (void 0 !== redT.users[napthe.uid]) {
								Promise.all(redT.users[napthe.uid].map(function(obj){
									obj.red({notice:{title:'THẤT BẠI', text: config[data.error_code], load: false}});
								}));
							}
						}
					});
				}
			}
		} catch(errX){
			//
		}
		return res.render('callback/prepaid_card');
	});
};
