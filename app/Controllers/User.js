
var User        = require('../Models/Users');
var UserInfo    = require('../Models/UserInfo');

// Game User
var TaiXiu_User     = require('../Models/TaiXiu_user');
var MiniPoker_User  = require('../Models/miniPoker/miniPoker_users');
var Bigbabol_User   = require('../Models/BigBabol/BigBabol_users');
var VQRed_User      = require('../Models/VuongQuocRed/VuongQuocRed_users');
var BauCua_User     = require('../Models/BauCua/BauCua_user');
var Mini3Cay_User   = require('../Models/Mini3Cay/Mini3Cay_user');
var CaoThap_User    = require('../Models/CaoThap/CaoThap_user');
var AngryBirds_user = require('../Models/AngryBirds/AngryBirds_user');

var validator   = require('validator');
var Helper      = require('../Helpers/Helpers');
var onHistory   = require('./user/onHistory');
var ket_sat     = require('./user/ket_sat');

var next_scene  = require('./user/next_scene');
var security    = require('./user/security');

var nhanthuong  = require('./user/nhanthuong');

var GameState = require('./GameState.js')

var first = function(client){
	UserInfo.findOne({id: client.UID}, 'name lastVip redPlay red xu ketSat UID phone cmt email security joinedOn', function(err, user) {
		if (!!user) {
			user = user._doc;
			var vipHT = ((user.redPlay-user.lastVip)/100000)>>0; // Điểm vip Hiện Tại
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
			delete user.lastVip;

			if (!Helper.isEmpty(user.phone)) {
				user.phone = Helper.cutPhone(user.phone)
			}

			if (!Helper.isEmpty(user.email)) {
				user.email = Helper.cutEmail(user.email)
			}

			client.profile = {name: user.name};

			addToListOnline(client);

			var data = {
				Authorized: true,
				user:       user,
			};
			client.red(data);
			GameState(client);
		}else{
			client.red({Authorized: false});
		}
	});
}

var updateCoint = function(client){
	UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
		if (!!user) {
			client.red({user: {red: user.red, xu: user.xu}});
		}
	});
}

var signName = function(client, name){
	if (!!name) {
		var az09     = new RegExp("^[a-zA-Z0-9]+$");
		var testName = az09.test(name);

		if (!validator.isLength(name, {min: 3, max: 14})) {
			client.red({notice: {title: "TÊN NHÂN VẬT", text: 'Độ dài từ 3 đến 14 ký tự !!'}});
		}else if (!testName) {
			client.red({notice: {title: "TÊN NHÂN VẬT", text: 'Tên không chứa ký tự đặc biệt !!'}});
		} else{
			UserInfo.findOne({id: client.UID}, 'name red xu ketSat UID phone email cmt security joinedOn', function(err, d){
				if (d == null) {
					var regex = new RegExp("^" + name + "$", 'i');
					User.findOne({'_id': client.UID}, function(err, base){
						var testBase = regex.test(base.local.username);
						if (testBase) {
							client.red({notice: {title: "TÊN NHÂN VẬT", text: "Tên nhân vật không được trùng với tên đăng nhập..."}});
						}else{
							UserInfo.findOne({'name': {$regex: regex}}, 'name', function(err, check){
								if (!!check) {
									client.red({notice: {title: "TÊN NHÂN VẬT", text: "Tên nhân vật đã tồn tại..."}});
								}else{
									try {
										UserInfo.create({'id':client.UID, 'name':name, 'joinedOn':new Date()}, function(errC, user){
											if (!!errC) {
												client.red({notice:{load: 0, title: 'LỖI', text: 'Tên nhân vật đã tồn tại.'}});
											}else{
												user = user._doc;
												user.level   = 1;
												user.vipNext = 100;
												user.vipHT   = 0;

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

												addToListOnline(client);

												var data = {
													Authorized: true,
													user: user,
												};
												client.profile = {name: user.name};
												
												TaiXiu_User.create({'uid': client.UID});
												MiniPoker_User.create({'uid': client.UID});
												Bigbabol_User.create({'uid': client.UID});
												VQRed_User.create({'uid': client.UID});
												BauCua_User.create({'uid': client.UID});
												Mini3Cay_User.create({'uid': client.UID});
												CaoThap_User.create({'uid': client.UID});
												AngryBirds_user.create({'uid': client.UID});

												GameState(client);
												client.red(data);
											}
										});
									} catch (error) {
										client.red({notice: {title: "TÊN NHÂN VẬT", text: "Tên nhân vật đã tồn tại..."}});
									}
								}
							})
						}
					});
				}else{
					first(client);
				}
			});
		}
	}
}

function changePassword(client, data){
	if (!!data && !!data.passOld && !!data.passNew && !!data.passNew2) {
		if (!validator.isLength(data.passOld, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.passNew, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.passNew2, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		} else if (data.passOld == data.passNew){
			client.red({notice: {title: "LỖI", text: 'Mật khẩu mới không trùng với mật khẩu cũ.!!'}});
		} else if (data.passNew != data.passNew2){
			client.red({notice: {title: "LỖI", text: 'Nhập lại mật khẩu không đúng.!!'}});
		} else {
			User.findOne({'_id': client.UID}, function(err, user){
				if (!!user) {
					if (Helper.validPassword(data.passOld, user.local.password)) {
						User.findOneAndUpdate({'_id': client.UID}, {$set:{'local.password': Helper.generateHash(data.passNew)}}, function(err, cat){
							client.red({notice:{load: 0, title: 'THÀNH CÔNG', text:'Đổi mật khẩu thành công.'}});
						});
					}else{
						client.red({notice:{load: 0, title: 'THẤT BẠI', text:'Mật khẩu cũ không đúng.'}});
					}
				}
			});
		}
	}
}

function getLevel(client){
	UserInfo.findOne({id:client.UID}, 'lastVip redPlay vip', function(err, user){
		var vipHT = ((user.redPlay-user.lastVip)/100000)>>0; // Điểm vip Hiện Tại
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

		client.red({profile:{level: {level: vipLevel, vipNext: vipNext, vipPre: vipPre, vipTL: user.vip, vipHT: vipHT}}});
	});
}

function addToListOnline(client){
	if (void 0 !== client.redT.users[client.UID]) {
		client.redT.users[client.UID].push(client);
	}else{
		client.redT.users[client.UID] = [client];
	}
}

function onData(client, data) {
	if (!!data) {
		if (!!data.doi_pass) {
			changePassword(client, data.doi_pass)
		}
		if (!!data.history) {
			onHistory(client, data.history)
		}
		if (!!data.ket_sat) {
			ket_sat(client, data.ket_sat)
		}
		if (!!data.updateCoint) {
			updateCoint(client);
		}
		if (!!data.getLevel) {
			getLevel(client);
		}
		if (!!data.nhanthuong) {
			nhanthuong(client);
		}
		if (!!data.security) {
			security(client, data.security);
		}
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
