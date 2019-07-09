
const User        = require('../Models/Users');
const UserInfo    = require('../Models/UserInfo');
// Game User
const TaiXiu_User    = require('../Models/TaiXiu_user');
const MiniPoker_User = require('../Models/miniPoker/miniPoker_users');
const Bigbabol_User  = require('../Models/BigBabol/BigBabol_users');
const VQRed_User     = require('../Models/VuongQuocRed/VuongQuocRed_users');
const BauCua_User    = require('../Models/BauCua/BauCua_user');
const Mini3Cay_User  = require('../Models/Mini3Cay/Mini3Cay_user');

const Helper      = require('../Helpers/Helpers');
const onHistory   = require('./user/onHistory');
const ket_sat     = require('./user/ket_sat');

const next_scene  = require('./user/next_scene');

const GameState = require('./GameState.js')

const first = function(client, select){
	UserInfo.findOne({id: client.UID}, 'name redPlay red xu ketSat UID phone email security joinedOn', function(err, user) {
		if (!!user) {
			user = user._doc;
			var vipHT = (user.redPlay/100000)>>0; // Điểm vip Hiện Tại
			// Cấp vip hiện tại
			var vipLevel = 1;
			var vipPre   = 0;   // Điểm víp cấp Hiện tại
			var vipNext  = 100; // Điểm víp cấp tiếp theo
			if (vipHT >= 120000) {
				vipLevel = 9;
				vipPre   = 120000;
				vipNext  = 0;
			}else if (vipHT >= 50000){
				vipLevel = 8;
				vipPre   = 50000;
				vipNext  = 120000;
			}else if (vipHT >= 15000){
				vipLevel = 7;
				vipPre   = 15000;
				vipNext  = 50000;
			}else if (vipHT >= 6000){
				vipLevel = 6;
				vipPre   = 6000;
				vipNext  = 15000;
			}else if (vipHT >= 3000){
				vipLevel = 5;
				vipPre   = 3000;
				vipNext  = 6000;
			}else if (vipHT >= 1000){
				vipLevel = 4;
				vipPre   = 1000;
				vipNext  = 3000;
			}else if (vipHT >= 500){
				vipLevel = 3;
				vipPre   = 500;
				vipNext  = 1000;
			}else if (vipHT >= 100){
				vipLevel = 2;
				vipPre   = 100;
				vipNext  = 500;
			}
			user.level   = vipLevel;
			user.vipNext = vipNext-vipPre;
			user.vipHT   = vipHT-vipPre;


			delete user._id;
			delete user.redPlay;

			client.profile = user;
			var data = {
				Authorized: true,
				user:       user,
			};
			client.send(JSON.stringify(data));
			GameState(client);
		}else{
			client.send(JSON.stringify({Authorized: false}));
		}
	});
}

const updateCoint = function(client){
	UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
		client.send(JSON.stringify({user: user}));
	});
}

const signName = function(client, name){
	var userName = name.trim();
	var error = null;
	if (userName.length > 14 || userName.length < 3){
		error = 'Độ dài từ 3 đến 14 ký tự !!';
	}else if (userName.match(new RegExp("^[a-zA-Z0-9]+$")) === null){
		error = 'Tên không chứa ký tự đặc biệt !!';
	};
	if (error) {
		client.send(JSON.stringify({notice: {title: "TÊN NHÂN VẬT", text: error}}));
		return;
	}
	UserInfo.findOne({id: client.UID}, 'name red xu ketSat UID phone email security joinedOn', function(err, d){
		if (d == null) {
			var regex = new RegExp("^" + name + "$", 'i');
			User.findOne({'_id': client.UID}, function(err, base){
				var testBase = regex.test(base.local.username);
				if (testBase) {
					client.send(JSON.stringify({notice: {title: "TÊN NHÂN VẬT", text: "Tên nhân vật không được trùng với tên đăng nhập..."}}));
				}else{
					UserInfo.findOne({'name': {$regex: regex}}, 'name', function(err, check){
						if (!!check) {
							client.send(JSON.stringify({notice: {title: "TÊN NHÂN VẬT", text: "Tên nhân vật đã tồn tại..."}}));
						}else{
							UserInfo.create({'id':client.UID, 'name':name, 'joinedOn':new Date()}, function(errC, user){
								if (!!errC) {
									client.send(JSON.stringify({notice:{load: 0, title: 'LỖI', text: 'Tên nhân vật đã tồn tại.'}}));
								}else{
									user = user._doc;
									user.level   = 1;
									user.vipNext = 100;
									user.vipHT   = 0;

									delete user.birthyeah;
									delete user.birthmonth;
									delete user.birthday;

									delete user._id;
									delete user.redWin;
									delete user.redLost;
									delete user.redPlay;
									delete user.xuWin;
									delete user.xuLost;
									delete user.xuPlay;
									delete user.thuong;
									delete user.vip;
									delete user.hu;
									delete user.huXu;

									var data = {
										Authorized: true,
										user: user,
									};
									client.profile = user;
									TaiXiu_User.create({'uid': client.UID});
									MiniPoker_User.create({'uid': client.UID});
									Bigbabol_User.create({'uid': client.UID});
									VQRed_User.create({'uid': client.UID});
									BauCua_User.create({'uid': client.UID});
									Mini3Cay_User.create({'uid': client.UID});
									GameState(client);
									client.send(JSON.stringify(data));
								}
							});
						}
					})
				}
			});
		}else{
			d = d._doc;
			delete d._id;
			client.send(JSON.stringify({user: d}));
		}
	});
}

function changePassword(client, data){
	var error = null;
	if (data.passOld.length > 32 ||
		data.passOld.length < 6 ||
		data.passNew.length > 32 ||
		data.passNew.length < 6 ||
		data.passNew2.length > 32 ||
		data.passNew2.length < 6)
	{
		error = 'Mật khẩu từ 6 - 32 kí tự.';
	} else if (data.passOld == data.passNew){
		error = 'Mật khẩu mới không trùng với mật khẩu cũ.!!';
	} else if (data.passNew != data.passNew2){
		error = 'Nhập lại mật khẩu không đúng!!';
	}

	if (error) {
		client.send(JSON.stringify({notice:{load: 0, title: 'LỖI', text: error}}));
	}else{
		User.findOne({'_id': client.UID}, function(err, user){
			if (user !== null) {
				if (Helper.validPassword(data.passOld, user.local.password)) {
					User.findOneAndUpdate({'_id': client.UID}, {'local.password':Helper.generateHash(data.passNew)}, function(err, cat){
						client.send(JSON.stringify({notice:{load: 0, title: 'THÀNH CÔNG', text:'Đổi mật khẩu thành công.'}}));
					});
				}else{
					client.send(JSON.stringify({notice:{load: 0, title: 'THÀNH CÔNG', text:'Mật khẩu cũ không đúng.'}}));
				}
			}
		});
	}
}

function getLevel(client){
	UserInfo.findOne({id:client.UID}, 'redPlay vip', function(err, user){
		var vipHT = (user.redPlay/100000)>>0; // Điểm vip Hiện Tại
		// Cấp vip hiện tại
		var vipLevel = 1;
		var vipPre   = 0; // Điểm víp cấp Hiện tại
		var vipNext  = 100; // Điểm víp cấp tiếp theo
		if (vipHT >= 120000) {
			vipLevel = 9;
			vipPre   = 120000;
			vipNext  = 0;
		}else if (vipHT >= 50000){
			vipLevel = 8;
			vipPre   = 50000;
			vipNext  = 120000;
		}else if (vipHT >= 15000){
			vipLevel = 7;
			vipPre   = 15000;
			vipNext  = 50000;
		}else if (vipHT >= 6000){
			vipLevel = 6;
			vipPre   = 6000;
			vipNext  = 15000;
		}else if (vipHT >= 3000){
			vipLevel = 5;
			vipPre   = 3000;
			vipNext  = 6000;
		}else if (vipHT >= 1000){
			vipLevel = 4;
			vipPre   = 1000;
			vipNext  = 3000;
		}else if (vipHT >= 500){
			vipLevel = 3;
			vipPre   = 500;
			vipNext  = 1000;
		}else if (vipHT >= 100){
			vipLevel = 2;
			vipPre   = 100;
			vipNext  = 500;
		}

		client.send(JSON.stringify({profile:{level: {level: vipLevel, vipNext: vipNext, vipPre: vipPre, vipTL: user.vip, vipHT: vipHT}}}));
	});
}

function onData(client, data) {
	if (void 0 !== data.doi_pass) {
		changePassword(client, data.doi_pass)
	}
	if (void 0 !== data.history) {
		onHistory(client, data.history)
	}
	if (void 0 !== data.ket_sat) {
		ket_sat(client, data.ket_sat)
	}
	if (void 0 !== data.updateCoint) {
		updateCoint(client);
	}
	if (void 0 !== data.getLevel) {
		getLevel(client);
	}
}

module.exports = {
	first:       first,
	signName:    signName,
	onData:      onData,
	next_scene:  next_scene,
	updateCoint: updateCoint,
	getLevel:    getLevel,
}
