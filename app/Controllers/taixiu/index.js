
var TXPhien = require('../../Models/TaiXiu_phien');
var TXCuoc  = require('../../Models/TaiXiu_cuoc');
var TXChat  = require('../../Models/TaiXiu_chat');
var TaiXiu_User = require('../../Models/TaiXiu_user');

var TXCuocOne  = require('../../Models/TaiXiu_one');

var UserInfo = require('../../Models/UserInfo');

var validator = require('validator');

function getLogs(client){
	var username = '';

	var TaiXiu_red_tong_tai   = 0;
	var TaiXiu_red_tong_xiu   = 0;
	var TaiXiu_red_me_tai     = 0;
	var TaiXiu_red_me_xiu     = 0;
	var taixiu_red_player_tai = 0;
	var taixiu_red_player_xiu = 0;
	var taixiu_red_player_tai_temp = new Array();
	var taixiu_red_player_xiu_temp = new Array();

	var TaiXiu_xu_tong_tai   = 0;
	var TaiXiu_xu_tong_xiu   = 0;
	var TaiXiu_xu_me_tai     = 0;
	var TaiXiu_xu_me_xiu     = 0;
	var taixiu_xu_player_tai = 0;
	var taixiu_xu_player_xiu = 0;
	var taixiu_xu_player_tai_temp = new Array();
	var taixiu_xu_player_xiu_temp = new Array();

	var ChanLe_red_tong_chan   = 0;
	var ChanLe_red_tong_le     = 0;
	var ChanLe_red_me_chan     = 0;
	var ChanLe_red_me_le       = 0;
	var chanle_red_player_chan = 0;
	var chanle_red_player_le   = 0;
	var chanle_red_player_chan_temp = new Array();
	var chanle_red_player_le_temp   = new Array();

	var ChanLe_xu_tong_chan   = 0;
	var ChanLe_xu_tong_le     = 0;
	var ChanLe_xu_me_chan     = 0;
	var ChanLe_xu_me_le       = 0;
	var chanle_xu_player_chan = 0;
	var chanle_xu_player_le   = 0;
	var chanle_xu_player_chan_temp = new Array();
	var chanle_xu_player_le_temp   = new Array();

	var active1 = new Promise((resolve, reject) => {
		TXPhien.find({}, {}, {sort:{'id':-1}, limit: 125}, function(err, post) {
			if (err) return reject(err)
			Promise.all(post.map(function(obj){return {'dice':[obj.dice1,obj.dice2,obj.dice3], 'phien':obj.id}}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});
	var active2 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, 'name', function(err, user){
			username = user.name
		});
		TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
			if (last !== null){
				var phien = last.id+1;

				TXCuoc.find({phien:phien}, async function(err, list) {
					//console.log(list)
					var cuoc_data = new Promise((resolve2, reject) => {
						Promise.all(list.filter(function(obj){
							if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
								TaiXiu_red_tong_tai += obj.bet;
								if(taixiu_red_player_tai_temp[obj.name] === void 0) taixiu_red_player_tai_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
								TaiXiu_red_tong_xiu += obj.bet;
								if(taixiu_red_player_xiu_temp[obj.name] === void 0) taixiu_red_player_xiu_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
								TaiXiu_xu_tong_tai += obj.bet;
								if(taixiu_xu_player_tai_temp[obj.name] === void 0) taixiu_xu_player_tai_temp[obj.name] = 1;
							} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
								TaiXiu_xu_tong_xiu += obj.bet;
								if(taixiu_xu_player_xiu_temp[obj.name] === void 0) taixiu_xu_player_xiu_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
								ChanLe_red_tong_chan += obj.bet;
								if(chanle_red_player_chan_temp[obj.name] === void 0) chanle_red_player_chan_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
								ChanLe_red_tong_le += obj.bet;
								if(chanle_red_player_le_temp[obj.name] === void 0) chanle_red_player_le_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
								ChanLe_xu_tong_chan += obj.bet;
								if(chanle_xu_player_chan_temp[obj.name] === void 0) chanle_xu_player_chan_temp[obj.name] = 1;
							} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
								ChanLe_xu_tong_le += obj.bet;
								if(chanle_xu_player_le_temp[obj.name] === void 0) chanle_xu_player_le_temp[obj.name] = 1;
							}

							return obj.name == username
						}))
						.then(function(arrayOfResults) {
							resolve2(arrayOfResults)
						})
					});
					Promise.all([cuoc_data]).then(values => {
						taixiu_red_player_tai  = Object.keys(taixiu_red_player_tai_temp).length
						taixiu_red_player_xiu  = Object.keys(taixiu_red_player_xiu_temp).length
						taixiu_xu_player_tai   = Object.keys(taixiu_xu_player_tai_temp).length
						taixiu_xu_player_xiu   = Object.keys(taixiu_xu_player_xiu_temp).length
						chanle_red_player_chan = Object.keys(chanle_red_player_chan_temp).length
						chanle_red_player_le   = Object.keys(chanle_red_player_le_temp).length
						chanle_xu_player_chan  = Object.keys(chanle_xu_player_chan_temp).length
						chanle_xu_player_le    = Object.keys(chanle_xu_player_le_temp).length
						Promise.all(values[0].map(function(obj){
							if (obj.taixiu == true && obj.red == true && obj.select == true){           // Me Red Tài
								TaiXiu_red_me_tai += obj.bet
							} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Me Red Xỉu
								TaiXiu_red_me_xiu += obj.bet
							} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Me Xu Tài
								TaiXiu_xu_me_tai += obj.bet
							} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Me Xu Xỉu
								TaiXiu_xu_me_xiu += obj.bet
							} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Me Red Chẵn
								ChanLe_red_me_chan += obj.bet
							} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Me Red Lẻ
								ChanLe_red_me_le += obj.bet
							} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Me xu Chẵn
								ChanLe_xu_me_chan += obj.bet
							} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Me xu Lẻ
								ChanLe_xu_me_le += obj.bet
							}
							return true
						}))
						.then(function(arrayOfResults) {
							resolve(true)
						})
					}, reason => {
						console.log(reason)
					});
				});
			}
		});
	});

	var active3 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid: client.UID}, 'tLineWinRed tLineLostRed tLineWinXu tLineLostXu cLineWinRed cLineLostRed cLineWinXu cLineLostXu tLineWinRedH tLineLostRedH tLineWinXuH tLineLostXuH cLineWinRedH cLineLostRedH cLineWinXuH cLineLostXuH', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2, active3]).then(values => {
		client.red({taixiu:{du_day: values[2], logs: values[0], taixiu:{ red_tai: TaiXiu_red_tong_tai, red_xiu: TaiXiu_red_tong_xiu, xu_tai: TaiXiu_xu_tong_tai, xu_xiu: TaiXiu_xu_tong_xiu, red_me_tai: TaiXiu_red_me_tai, red_me_xiu: TaiXiu_red_me_xiu, xu_me_tai: TaiXiu_xu_me_tai, xu_me_xiu: TaiXiu_xu_me_xiu, red_player_tai: taixiu_red_player_tai, red_player_xiu: taixiu_red_player_xiu, xu_player_tai: taixiu_xu_player_tai, xu_player_xiu: taixiu_xu_player_xiu, }, chanle:{ red_chan: ChanLe_red_tong_chan, red_le: ChanLe_red_tong_le, xu_chan: ChanLe_xu_tong_chan, xu_le: ChanLe_xu_tong_le, red_me_chan: ChanLe_red_me_chan, red_me_le: ChanLe_red_me_le, xu_me_chan: ChanLe_xu_me_chan, xu_me_le: ChanLe_xu_me_le, red_player_chan: chanle_red_player_chan, red_player_le: chanle_red_player_le, xu_player_chan: chanle_xu_player_chan, xu_player_le: chanle_xu_player_le}}});
	}, reason => {
		console.log(reason)
	});
}

function getNew(client){
	var active1 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
			if (err) return reject(err)
			resolve(user)
		});
	});
	var active2 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid: client.UID}, 'tLineWinRed tLineLostRed tLineWinXu tLineLostXu cLineWinRed cLineLostRed cLineWinXu cLineLostXu tLineWinRedH tLineLostRedH tLineWinXuH tLineLostXuH cLineWinRedH cLineLostRedH cLineWinXuH cLineLostXuH', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2]).then(values => {
		//console.log(values)
		client.red({user: values[0], taixiu: {du_day: values[1]}});
	}, reason => {
		console.log(reason)
	});
}

var chat = function(client, str){
	if (!!str) {
		if (!validator.isLength(str, {min: 1, max: 250})) {
			client.red({taixiu:{err: 'Số lượng kí tự từ 1 - 250.'}});
		}else{
			str = validator.trim(str);
			if (!validator.isLength(str, {min: 1, max: 250})) {
				client.red({taixiu:{err: 'Số lượng kí tự từ 1 - 250.'}});
			}else{
				TXChat.findOne({}, 'uid value', {sort:{'id':-1}}, function(err, post) {
					if (!post || (post.uid != client.UID && post.value != str)) {
						TXChat.create({'uid':client.UID, 'name':client.profile.name, 'value':str});
						var content = {taixiu:{chat:{message:{user:client.profile.name, value:str}}}};
						Promise.all(Object.values(client.redT.users).map(function(users){
							Promise.all(users.map(function(member){
								if (member != client){
									member.red(content);
								}
							});
						});
					}
				});
			}
		}
	}
}

var cuoc = function(client, data){
	if (!!data && !!data.bet) {
		if (client.redT.TaiXiu_time < 2 || client.redT.TaiXiu_time > 60) {
			client.red({taixiu:{err:'Vui lòng cược ở phiên sau.!!'}});
		}else{
			var bet    = data.bet>>0;   // Số tiền
			var taixiu = !!data.taixiu; // Tài xỉu:true    Chẵn lẻ:false
			var red    = !!data.red;    // Loại tiền (Red: true, Xu: false)
			var select = !!data.select; // Cửa đặt (Tài: 1, Xỉu: 0)

			if (bet < 1000) {
				client.red({taixiu:{err:'Số tiền phải lớn hơn 1000.!!'}});
			}else{
				UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
					if (user === null || (red && user.red < bet) || (!red && user.xu < bet)) {
						client.red({taixiu:{err: 'Bạn không đủ ' + (red ? 'Red':'Xu') + ' để cược.!!'}});
					}else{
						var phien = client.redT.TaiXiu_phien;
						TXCuocOne.findOne({uid:client.UID, phien:phien, taixiu:taixiu, red:red}, function(isCuocErr, isCuoc) {
							if (!!isCuoc) {
								// update
								if (isCuoc.select !== select) {
									client.red({taixiu: {err:'Chỉ được cược 1 bên.!!'}});
								}else{
									var updateINC = red ? {$inc:{red:-bet}} : {$inc:{xu:-bet}};
									UserInfo.findOneAndUpdate({id:client.UID}, updateINC, function(err,cat){});
									TXCuocOne.findOneAndUpdate({uid: client.UID, phien: phien, taixiu:taixiu, select:select, red:red}, {$inc:{bet:bet}}, function(err, cat){});
									TXCuoc.create({uid:client.UID, name:user.name, phien:phien, bet:bet, taixiu:taixiu, select:select, red:red, time:new Date()}, function(err, cat){});

									var taixiuVery = (red ? (select ? (taixiu ? {red_me_tai: isCuoc.bet*1+bet} : {red_me_chan: isCuoc.bet*1+bet}) : (taixiu ? {red_me_xiu: isCuoc.bet*1+bet} : {red_me_le: isCuoc.bet*1+bet})) : (select ? (taixiu ? {xu_me_tai: isCuoc.bet*1+bet} : {xu_me_chan: isCuoc.bet*1+bet}) : (taixiu ? {xu_me_xiu: isCuoc.bet*1+bet} : {xu_me_le: isCuoc.bet*1+bet})));
									taixiuVery = (taixiu ? {taixiu: taixiuVery} : {chanle: taixiuVery});

									if (!!client.redT.users[client.UID]) {
										Promise.all(client.redT.users[client.UID].map(function(obj){
											obj.red({taixiu:taixiuVery, user:red ? {red:user.red-bet} : {xu:user.xu-bet}});
										}));
									}
								}
							}else{
								// cuoc
								var updateINC = red ? {$inc:{red:-bet}} : {$inc:{xu:-bet}};
								UserInfo.findOneAndUpdate({id:client.UID}, updateINC, function(err,cat){});
								TXCuocOne.create({uid: client.UID, phien: phien, taixiu:taixiu, select:select, red:red, bet:bet});
								TXCuoc.create({uid:client.UID, name:user.name, phien:phien, bet:bet, taixiu:taixiu, select:select, red:red, time:new Date()}, function(err, cat){});

								var taixiuVery = (red ? (select ? (taixiu ? {red_me_tai:bet} : {red_me_chan:bet}) : (taixiu ? {red_me_xiu:bet} : {red_me_le:bet})) : (select ? (taixiu ? {xu_me_tai:bet} : {xu_me_chan:bet}) : (taixiu ? {xu_me_xiu:bet} : {xu_me_le:bet})));
								taixiuVery = (taixiu ? {taixiu: taixiuVery} : {chanle: taixiuVery});

								if (!!client.redT.users[client.UID]) {
									Promise.all(client.redT.users[client.UID].map(function(obj){
										obj.red({taixiu:taixiuVery, user:red ? {red:user.red-bet} : {xu:user.xu-bet}});
									}));
								}
							}
						});
					}
				});
			}
		}
	}
}

var get_phien = function(client, data){
	if (!!data && !!data.phien) {
		var phien  = data.phien>>0;
		var taixiu = !!data.taixiu;
		var red    = !!data.red;

		var getPhien = TXPhien.findOne({id: phien}).exec();
		var getCuoc  = TXCuocOne.find({phien: phien, taixiu:taixiu, red:red}).exec();

		var tong_L        = 0;
		var tong_R        = 0;
		var tong_tralai_L = 0;
		var tong_tralai_R = 0;

		Promise.all([getPhien, getCuoc]).then(values => {
			if (!!values[0] && values[1].length > 0) {
				var infoPhienCuoc = values[0];
				var phienCuoc     = values[1];

				var dataT = {};
				dataT['phien'] = phien;
				dataT['time']  = infoPhienCuoc.time;
				dataT['dice']  = [infoPhienCuoc.dice1, infoPhienCuoc.dice2, infoPhienCuoc.dice3];
				var dataL = new Promise((resolve, reject) => {
					Promise.all(phienCuoc.filter(function(obj){
						if(obj.select){
							tong_L += obj.bet
							tong_tralai_L += obj.tralai
						} else {
							tong_R += obj.bet
							tong_tralai_R += obj.tralai
						}
						return obj.select == 1
					}))
					.then(function(arrayOfResults) {
						resolve(arrayOfResults)
					})
				});
				var dataR = new Promise((resolve, reject) => {
					Promise.all(phienCuoc.filter(function(obj){
						return obj.select == 0
					}))
					.then(function(arrayOfResults) {
						resolve(arrayOfResults)
					})
				});
				Promise.all([dataL, dataR]).then(result => {
					dataT['tong_L']        = tong_L;
					dataT['tong_R']        = tong_R;
					dataT['tong_tralai_L'] = tong_tralai_L;
					dataT['tong_tralai_R'] = tong_tralai_R;
					dataT['dataL'] = result[0];
					dataT['dataR'] = result[1];
					client.red({taixiu:{get_phien:dataT}});
				});
			}else{
				client.red({notice:{title: 'LỖI', text: 'Phiên không tồn tại...', }});
			}
		});
	}
}

var get_log = function(client, data){
	if (!!data && !!data.page) {
		var page  = data.page>>0;
		var kmess = 11;
		if (page > 0) {
			TXCuoc.countDocuments({uid: client.UID}).exec(function(err, total){
				var getCuoc = TXCuoc.find({uid:client.UID, thanhtoan:true}, {}, {sort:{'id':-1}, skip: (page-1)*kmess, limit: kmess}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							var getPhien = TXPhien.findOne({id: obj.phien}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								delete obj.thanhtoan;
								delete obj.id;
								delete obj.uid;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({taixiu:{get_log:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
						})
					}else{
						client.red({taixiu:{get_log:{data: [], page:page, kmess:kmess, total:0}}});
					}
				});
			});
		}
	}
}

var get_top = async function(client, data){
	if (!!data) {
		var taixiu = !!data.taixiu;
		var red    = !!data.red;
		var query  = 'uid ' + (taixiu ? (red ? 'tWinRed' : 'tWinXu') : (red ? 'cWinRed' : 'cWinXu'));
		var sort   = taixiu ? (red ? {'tWinRed':-1} : {'tWinXu':-1}) : (red ? {'cWinRed':-1} : {'cWinXu':-1});
		TaiXiu_User.find({}, query, {sort: sort, limit: 50}, function(err, result){
			if (result.length) {
				Promise.all(result.map(function(obj){
					var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
					return Promise.all([getUser]).then(values => {
						return values[0] ? {name: values[0].name, bet: (taixiu ? (red ? obj.tWinRed : obj.tWinXu) : (red ? obj.cWinRed : obj.cWinXu))} : [];
					});
				}))
				.then(function(arrayOfResults) {
					client.red({taixiu:{get_top:arrayOfResults}});
				})
			}
		});
	}
}

module.exports = {
	getLogs:   getLogs,
	chat:      chat,
	cuoc:      cuoc,
	get_phien: get_phien,
	get_log:   get_log,
	get_top:   get_top,
	getNew:    getNew,
}
