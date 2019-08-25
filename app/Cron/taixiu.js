
var path        = require('path');
var fs          = require('fs');

var Helpers     = require('../Helpers/Helpers');

var UserInfo    = require('../Models/UserInfo');
var TXPhien     = require('../Models/TaiXiu_phien');
var TXCuoc      = require('../Models/TaiXiu_cuoc');
var TaiXiu_User = require('../Models/TaiXiu_user');
var TXCuocOne   = require('../Models/TaiXiu_one');

// Hũ game
var HU_game    = require('../Models/HU');

var bot        = require('./taixiu/bot');
var botList    = [];

var dataTaiXiu = '../../data/taixiu.json';
var io         = null;
var gameLoop   = null;

function init(obj){
	io = obj;

	io.taixiu = {
		chanle: {
			red_chan: 0,
			red_le: 0,
			red_player_chan: 0,
			red_player_le: 0,
			xu_chan: 0,
			xu_le: 0,
			xu_player_chan: 0,
			xu_player_le: 0,
		},
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
			xu_player_tai: 0,
			xu_player_xiu: 0,
			xu_tai: 0,
			xu_xiu: 0,
		}
	};

	io.taixiuAdmin = {
		chanle: {
			red_chan: 0,
			red_le: 0,
			red_player_chan: 0,
			red_player_le: 0,
			xu_chan: 0,
			xu_le: 0,
			xu_player_chan: 0,
			xu_player_le: 0,
		},
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
			xu_player_tai: 0,
			xu_player_xiu: 0,
			xu_tai: 0,
			xu_xiu: 0,
		},
		list: []
	};

	playGame();
}

TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (!!last){
		io.TaiXiu_phien = last.id+1;
	}
})

function truChietKhau(bet, phe){
	return bet-Math.ceil(bet*phe/100);
}

// Dữ liệu Hũ
function TopHu(){
	var huH = HU_game.find({}, 'game type red bet toX balans x').exec(function(err, data){
		if (data.length) {
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				delete obj._id;
				return obj;
			}))
			.then(result => {
				var temp_data = {TopHu: {
					mini_poker: result.filter(function(mini_poker){
						return (mini_poker.game == "minipoker")
					}),
					big_babol: result.filter(function(big_babol){
						return (big_babol.game == "bigbabol")
					}),
					vq_red: result.filter(function(vq_red){
						return (vq_red.game == "vuongquocred")
					}),
					mini3cay: result.filter(function(mini3cay){
						return (mini3cay.game == "mini3cay")
					}),
					caothap: result.filter(function(caothap){
						return (caothap.game == "caothap")
					}),
					arb: result.filter(function(arb){
						return (arb.game == "arb")
					}),
					candy: result.filter(function(candy){
						return (candy.game == "candy")
					})
				}};
				io.broadcast(temp_data);
			})
		}
	});
}

function setTaiXiu_user(phien, dice){
	TXCuocOne.find({phien: phien}, {}, function(err, list) {
		if (list.length){
			Promise.all(list.map(function(obj){
				var action = new Promise((resolve, reject)=> {
					TaiXiu_User.findOne({uid: obj.uid}, function(error, data) {
						let bet_thua = obj.bet-obj.tralai;
						let bet = obj.win ? obj.betwin+obj.bet : bet_thua;
						let update = {};
						if (obj.taixiu == true && obj.red == true && bet_thua >= 10000) {          // Red Tài Xỉu
							update = {
								tLineWinRed:   obj.win && data.tLineWinRed < data.tLineWinRedH+1 ? data.tLineWinRedH+1 : data.tLineWinRed,
								tLineLostRed:  !obj.win && data.tLineLostRed < data.tLineLostRedH+1 ? data.tLineLostRedH+1 : data.tLineLostRed,
								tLineWinRedH:  obj.win ? data.tLineWinRedH+1 : 0,
								tLineLostRedH: obj.win ? 0 : data.tLineLostRedH+1,
								time:          new Date(),
							};
						} else if (obj.taixiu == true && obj.red == false && bet_thua >= 10000) { // Xu Tài Xỉu
							update = {
								tLineWinXu:   obj.win && data.tLineWinXu < data.tLineWinXuH+1 ? data.tLineWinXuH+1 : data.tLineWinXu,
								tLineLostXu:  !obj.win && data.tLineLostXu < data.tLineLostXuH+1 ? data.tLineLostXuH+1 : data.tLineLostXu,
								tLineWinXuH:  obj.win ? data.tLineWinXuH+1 : 0,
								tLineLostXuH: obj.win ? 0 : data.tLineLostXuH+1,
							}
						} else if (obj.taixiu == false && obj.red == true && bet_thua >= 10000) { // Red Chẵn Lẻ
							update = {
								cLineWinRed:   obj.win && data.cLineWinRed < data.cLineWinRedH+1 ? data.cLineWinRedH+1 : data.cLineWinRed,
								cLineLostRed:  !obj.win && data.cLineLostRed < data.cLineLostRedH+1 ? data.cLineLostRedH+1 : data.cLineLostRed,
								cLineWinRedH:  obj.win ? data.cLineWinRedH+1 : 0,
								cLineLostRedH: obj.win ? 0 : data.cLineLostRedH+1,
							}
						} else if (obj.taixiu == false && obj.red == false && bet_thua >= 10000) { // Xu Chẵn Lẻ
							update = {
								cLineWinXu:   obj.win && data.cLineWinXu < data.cLineWinXuH+1 ? data.cLineWinXuH+1 : data.cLineWinXu,
								cLineLostXu:  !obj.win && data.cLineLostXu < data.cLineLostXuH+1 ? data.cLineLostXuH+1 : data.cLineLostXu,
								cLineWinXuH:  obj.win ? data.cLineWinXuH+1 : 0,
								cLineLostXuH: obj.win ? 0 : data.cLineLostXuH+1,
							}
						}

						!!Object.entries(update).length && TaiXiu_User.updateOne({uid: obj.uid}, {$set:update}).exec();

						if(void 0 !== io.users[obj.uid]){
							Promise.all(io.users[obj.uid].map(function(client){
								client.red({taixiu:{status:{win:obj.win, thuong:obj.thuong, select:obj.select, bet: bet}}});
							}));
						}

						resolve({uid: obj.uid, red: obj.red, taixiu:obj.taixiu, betwin: obj.betwin});
					});
				});
				return action;
			}))
			.then(values => {
				Promise.all(values.filter(function(obj){
					return obj.red && obj.betwin > 0;
				}))
				.then(results => {
					if (results.length) {
						var topTaiXiu = results.filter(function(objTopT){
							return !!objTopT.taixiu;
						});
						var topChanLe = results.filter(function(objTopC){
							return !objTopC.taixiu;
						});
						topTaiXiu.sort(function(a, b){
							return b.betwin-a.betwin;
						});
						topChanLe.sort(function(a, b){
							return b.betwin-a.betwin;
						});
						var top10TX = topTaiXiu.slice(0, 10);
						var top10CL = topChanLe.slice(0, 10);
						results = [...top10TX, ...top10CL];

						results = Helpers.shuffle(results);

						Promise.all(results.map(function(obj){
							var action = new Promise((resolve, reject) => {
								UserInfo.findOne({id: obj.uid}, 'name', function(err, users){
									if (obj.taixiu) {
										resolve({users: users.name, bet: Helpers.numberWithCommas(obj.betwin), game: 'Tài Xỉu'});
									}else{
										resolve({users: users.name, bet: Helpers.numberWithCommas(obj.betwin), game: 'Chẵn Lẻ'});
									}
								});
							});
							return action;
						}))
						.then(result => {
							result = {news:{a:result}};
							Promise.all(Object.values(io.users).map(function(users){
								Promise.all(users.map(function(client){
									if(client.scene == "home"){
										client.red(result);
									}
								}));
							}));
							io.sendAllClient(result);
						})
					}
				})
			})
		}
	});
}


function thongtin_thanhtoan(game_id, dice = false){
	if (dice) {
		var TaiXiu_red_tong_tai   = 0;
		var TaiXiu_red_tong_xiu   = 0;
		var taixiu_red_player_tai = 0;
		var taixiu_red_player_xiu = 0;
		var taixiu_red_player_tai_temp = new Array();
		var taixiu_red_player_xiu_temp = new Array();

		var TaiXiu_xu_tong_tai   = 0;
		var TaiXiu_xu_tong_xiu   = 0;
		var taixiu_xu_player_tai = 0;
		var taixiu_xu_player_xiu = 0;
		var taixiu_xu_player_tai_temp = new Array();
		var taixiu_xu_player_xiu_temp = new Array();

		var ChanLe_red_tong_chan   = 0;
		var ChanLe_red_tong_le     = 0;
		var chanle_red_player_chan = 0;
		var chanle_red_player_le   = 0;
		var chanle_red_player_chan_temp = new Array();
		var chanle_red_player_le_temp   = new Array();

		var ChanLe_xu_tong_chan   = 0;
		var ChanLe_xu_tong_le     = 0;
		var chanle_xu_player_chan = 0;
		var chanle_xu_player_le   = 0;
		var chanle_xu_player_chan_temp = new Array();
		var chanle_xu_player_le_temp   = new Array();

		TXCuoc.find({phien:game_id}, null, {sort:{'_id':-1}}, function(err, list) {
			if(list.length){
				Promise.all(list.map(function(obj){
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
					return void 0;
				}))
				.then(function(arrayOfResults) {
					var TaiXiu_tong_red_lech = Math.abs(TaiXiu_red_tong_tai  - TaiXiu_red_tong_xiu);
					var TaiXiu_tong_xu_lech  = Math.abs(TaiXiu_xu_tong_tai   - TaiXiu_xu_tong_xiu);
					var ChanLe_tong_red_lech = Math.abs(ChanLe_red_tong_chan - ChanLe_red_tong_le);
					var ChanLe_tong_xu_lech  = Math.abs(ChanLe_xu_tong_chan  - ChanLe_xu_tong_le);

					var TaiXiu_red_lech_tai  = TaiXiu_red_tong_tai  > TaiXiu_red_tong_xiu ? true : false;
					var TaiXiu_xu_lech_tai   = TaiXiu_xu_tong_tai   > TaiXiu_xu_tong_xiu  ? true : false;
					var ChanLe_red_lech_chan = ChanLe_red_tong_chan > ChanLe_red_tong_le  ? true : false;
					var ChanLe_xu_lech_chan  = ChanLe_xu_tong_chan  > ChanLe_xu_tong_le   ? true : false;

					Promise.all(list.map(function(obj){
						let userUpdate = {};
						let oneUpdate  = {};
						if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
							let win = dice > 10 ? true : false;
							if (TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
								if (TaiXiu_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_red_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									var active1 = UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-TaiXiu_tong_red_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = TaiXiu_tong_red_lech;
									TaiXiu_tong_red_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 2);
										obj.betwin    = betwinP;
										var redUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwinP, tRedPlay: betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redPlay:betPlay, redLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:betPlay, tRedPlay: betPlay}}).exec();
									}
									obj.save();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
									return Promise.all([active]);
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin    = truChietKhau(obj.bet, 2);
									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									let redUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwin, tRedPlay: obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{redLost:obj.bet, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
							let win = dice > 10 ? false : true;
							if (!TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
								if (TaiXiu_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_red_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									var active1 = UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-TaiXiu_tong_red_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = TaiXiu_tong_red_lech;
									TaiXiu_tong_red_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 2);
										obj.betwin    = betwinP;
										var redUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwinP, tRedPlay:betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redPlay: betPlay, redLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:betPlay, tRedPlay:betPlay}}).exec();
									}
									obj.save();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
									return Promise.all([active]);
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin    = truChietKhau(obj.bet, 2);
									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									var redUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwin, tRedPlay: obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{redLost:obj.bet, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
							let win = dice > 10 ? true : false;
							if (TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
								if (TaiXiu_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_xu_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									var active1 = UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-TaiXiu_tong_xu_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = TaiXiu_tong_xu_lech;
									TaiXiu_tong_xu_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 4);
										obj.betwin = betwinP;
										var thuong = (betwinP*0.039589)>>0;

										oneUpdate.betwin = betwinP;
										oneUpdate.thuong = thuong;

										var xuUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:betwinP, tXuPlay: betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:betPlay, tXuPlay:betPlay}}).exec();
									}
									obj.save();
									oneUpdate.tralai = obj.tralai;
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// cập nhật tiền trả lại
									return Promise.all([active])
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin = truChietKhau(obj.bet, 4);
									var thuong = (betwin*0.039589)>>0;
									oneUpdate.thuong = thuong;
									oneUpdate.betwin = betwin;

									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									var xuUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:obj.bet, tXuPlay:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									var active1 = UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
									var active2 = TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:obj.bet, tXuPlay: obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
							let win = dice > 10 ? false : true;
							if (!TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
								if (TaiXiu_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_xu_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-TaiXiu_tong_xu_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = TaiXiu_tong_xu_lech;
									TaiXiu_tong_xu_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 4);
										obj.betwin = betwinP;
										var thuong = (betwinP*0.039589)>>0;

										oneUpdate.betwin = betwinP;
										oneUpdate.thuong = thuong;

										var xuUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:betwinP, tXuPlay: betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:betPlay, tXuPlay:betPlay}}).exec();
									}
									obj.save();
									oneUpdate.tralai = obj.tralai;
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// cập nhật tiền trả lại
									return Promise.all([active])
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin = truChietKhau(obj.bet, 4);
									var thuong = (betwin*0.039589)>>0;
									oneUpdate.thuong = thuong;
									oneUpdate.betwin = betwin;

									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									var xuUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:obj.bet, tXuPlay:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:obj.bet, tXuPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
							let win = dice%2 ? false : true;
							if (ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
								if (ChanLe_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_red_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-ChanLe_tong_red_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = ChanLe_tong_red_lech;
									ChanLe_tong_red_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 2);
										obj.betwin    = betwinP;
										var redUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwinP, redPlay:betPlay}}).exec();
										var active1 = TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwinP, cRedPlay:betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redLost:betPlay, redPlay:betPlay}}).exec();
										var active1 = TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:betPlay, cRedPlay:betPlay}}).exec();
									}
									obj.save();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
									return Promise.all([active])
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin    = truChietKhau(obj.bet, 2);
									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									let redUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwin, cRedPlay: obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{redPlay:obj.bet, redLost:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:obj.bet, cRedPlay: obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
							let win = dice%2 ? true : false;
							if (!ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
								if (ChanLe_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_red_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-ChanLe_tong_red_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = ChanLe_tong_red_lech;
									ChanLe_tong_red_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 2);
										obj.betwin    = betwinP;
										var redUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwinP, redPlay:betPlay}}).exec();
										var active1 = TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwinP, cRedPlay:betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redLost:betPlay, redPlay:betPlay}}).exec();
										var active1 = TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:betPlay, cRedPlay:betPlay}}).exec();
									}
									obj.save();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
									return Promise.all([active])
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin    = truChietKhau(obj.bet, 2);
									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									let redUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwin, cRedPlay: obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{redPlay:obj.bet, redLost:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:obj.bet, cRedPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
							let win = dice%2 ? false : true;
							if (ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
								if (ChanLe_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_xu_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-ChanLe_tong_xu_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = ChanLe_tong_xu_lech;
									ChanLe_tong_xu_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 4);
										obj.betwin = betwinP;
										var thuong = (betwinP*0.039589)>>0;

										oneUpdate.betwin = betwinP;
										oneUpdate.thuong = thuong;

										var xuUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:betwinP, cXuPlay: betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:betPlay, cXuPlay:betPlay}}).exec();
									}
									obj.save();
									oneUpdate.tralai = obj.tralai;
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}
							}else{
								if (win) {
									var betwin = truChietKhau(obj.bet, 4);
									var thuong = (betwin*0.039589)>>0;
									oneUpdate.thuong = thuong;
									oneUpdate.betwin = betwin;

									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									var xuUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:obj.bet, cXuPlay:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:obj.bet, cXuPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
							let win = dice%2 ? true : false;
							if (!ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
								if (ChanLe_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_xu_lech -= obj.bet
									// trả lại hoàn toàn
									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = obj.bet;
									obj.save();
									var active1 = UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2])
								}else{
									// Trả lại 1 phần
									var betPlay = obj.bet-ChanLe_tong_xu_lech;
									var betwinP = 0;

									obj.thanhtoan = true;
									obj.win       = win;
									obj.tralai    = ChanLe_tong_xu_lech;
									ChanLe_tong_xu_lech = 0;

									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// cộng tiền thắng
										betwinP = truChietKhau(betPlay, 4);
										obj.betwin = betwinP;
										var thuong = (betwinP*0.039589)>>0;

										oneUpdate.betwin = betwinP;
										oneUpdate.thuong = thuong;

										var xuUpdate = obj.bet+betwinP;
										UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:betwinP, cXuPlay: betPlay}}).exec();
									}else{
										UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
										TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:betPlay, cXuPlay:betPlay}}).exec();
									}
									obj.save();
									oneUpdate.tralai = obj.tralai;
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}
							}else{
								if (win) {
									// cộng tiền thắng hoàn toàn
									var betwin = truChietKhau(obj.bet, 4);
									var thuong = (betwin*0.039589)>>0;
									oneUpdate.thuong = thuong;
									oneUpdate.betwin = betwin;

									obj.thanhtoan = true;
									obj.win       = true;
									obj.betwin    = betwin;
									obj.save();

									var xuUpdate = obj.bet+betwin;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:obj.bet, cXuPlay:obj.bet}}).exec();
									var active = TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active])
								}else{
									obj.thanhtoan = true;
									obj.save();

									UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:obj.bet, cXuPlay:obj.bet}}).exec();
									return void 0;
								}
							}
						}
						return 1
					}))
					.then(function(arrayOfResults) {
						//Promise.all(arrayOfResults).then(function(data){
							playGame();
							setTaiXiu_user(game_id, dice);
						//})
					});
				}, reason => {
				});
			}else if (dice) {
				playGame();
			}
		});
	}else{

		// Users
		var home = {taixiu:{taixiu:{red_tai: io.taixiu.taixiu.red_tai, red_xiu: io.taixiu.taixiu.red_xiu}}};
		Promise.all(Object.values(io.users).map(function(users){
			Promise.all(users.map(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red({taixiu: io.taixiu});
				}else if(client.scene == "home"){
					client.red(home);
				}
			}));
		}));

		// Admin
		Promise.all(Object.values(io.admins).map(function(admin){
			Promise.all(admin.map(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu)
					client.red({taixiu: io.taixiuAdmin});
			}));
		}));

		// Khách
		if (!(io.TaiXiu_time%10)) {
			io.sendAllClient(home);
		}
	}
}

function playGame(){
	io.TaiXiu_time = 82-5;

	//io.TaiXiu_time = 82;
	//io.TaiXiu_time = 10

	gameLoop = setInterval(function(){
		if (!(io.TaiXiu_time%5)) {
			// Hũ
			TopHu();
		}

		io.TaiXiu_time--;
		if (io.TaiXiu_time <= 60) {
			if (io.TaiXiu_time < 0) {
				clearInterval(gameLoop);
				io.TaiXiu_time = 0;

				var file  = require(dataTaiXiu);

				var dice1 = parseInt(file.dice1 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice1);
				var dice2 = parseInt(file.dice2 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice2);
				var dice3 = parseInt(file.dice3 == 0 ? Math.floor(Math.random() * 6) + 1 : file.dice3);

				file.dice1  = 0;
				file.dice2  = 0;
				file.dice3  = 0;
				file.uid    = "";
				file.rights = 2;

				fs.writeFile(path.dirname(path.dirname(__dirname)) + "/data/taixiu.json", JSON.stringify(file), function(err){});

				TXPhien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()}, function(err, create){
					if (!!create) {
						io.TaiXiu_phien  = create.id+1;
						var chothanhtoan = thongtin_thanhtoan(create.id, dice1+dice2+dice3);
						io.sendAllUser({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});
						Promise.all(Object.values(io.admins).map(function(admin){
							Promise.all(admin.map(function(client){
								client.red({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});
							}));
						}));
					}
				});

				io.taixiu = {
					chanle: {
						red_chan: 0,
						red_le: 0,
						red_player_chan: 0,
						red_player_le: 0,
						xu_chan: 0,
						xu_le: 0,
						xu_player_chan: 0,
						xu_player_le: 0,
					},
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
						xu_player_tai: 0,
						xu_player_xiu: 0,
						xu_tai: 0,
						xu_xiu: 0,
					}
				};

				io.taixiuAdmin = {
					chanle: {
						red_chan: 0,
						red_le: 0,
						red_player_chan: 0,
						red_player_le: 0,
						xu_chan: 0,
						xu_le: 0,
						xu_player_chan: 0,
						xu_player_le: 0,
					},
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
						xu_player_tai: 0,
						xu_player_xiu: 0,
						xu_tai: 0,
						xu_xiu: 0,
					},
					list: []
				};

				var config = require('../../config/taixiu.json');
				if (config.bot) {
					// lấy danh sách tài khoản bot
					var TList = bot.list();
					TList.then(resultBot => {
						botList = Helpers.shuffle(resultBot); // tráo bot;
					});
				}else{
					botList = [];
				}
			}else{
				thongtin_thanhtoan(io.TaiXiu_phien);
				if (!!botList.length && io.TaiXiu_time > 5) {
					var userCuoc = (Math.random()*7)>>0;
					for (var i = 0; i < userCuoc; i++) {
						var dataT = botList[i];
						if (!!dataT) {
							bot.bet(dataT, io);
							botList.splice(i, 1); // Xoá bot đã đặt tránh trùng lặp
						}
					}
				}
			}
		}
	}, 1000)
	return gameLoop
}

module.exports = init;
