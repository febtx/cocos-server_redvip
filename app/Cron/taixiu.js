
var path        = require('path');
var fs          = require('fs');

var Helpers     = require('../Helpers/Helpers');

var UserInfo    = require('../Models/UserInfo')
var TXPhien     = require('../Models/TaiXiu_phien')
var TXCuoc      = require('../Models/TaiXiu_cuoc')
var TaiXiu_User = require('../Models/TaiXiu_user');
var TXCuocOne   = require('../Models/TaiXiu_one');

// Hũ game
var miniPokerHu     = require('../Models/miniPoker/miniPokerHu');
var BigBabol_hu     = require('../Models/BigBabol/BigBabol_hu');
var Mini3Cay_hu     = require('../Models/Mini3Cay/Mini3Cay_hu');
var HU_game         = require('../Models/HU');

var VuongQuocRed_hu = require('../Models/VuongQuocRed/VuongQuocRed_hu');

var dataTaiXiu = '../../data/taixiu.json';
var io       = null;
var gameLoop = null;

function init(obj){
	io = obj;
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
	var active1 = miniPokerHu.find({}, 'type red bet').exec();
	var active2 = BigBabol_hu.find({}, 'type red bet').exec();
	var active3 = VuongQuocRed_hu.find({}, 'type red bet').exec();
	var active4 = Mini3Cay_hu.find({}, 'type red bet').exec();

	var huH = HU_game.find({}, 'game type red bet').exec();

	Promise.all([active1, active2, active3, active4, huH]).then(result => {
		Promise.all(result.map(function(temp){
			return Promise.all(temp.map(function(obj){
				obj = obj._doc;
				delete obj._id;
				return obj;
			})).then(resultArray =>{
				return resultArray;
			})
		}))
		.then(resultArray2 => {
			var temp_data = {TopHu: {
				mini_poker: result[0],
				big_babol: result[1],
				vq_red: result[2],
				mini3cay: result[3],
				caothap: result[4].filter(function(arb){
					return (arb.game == "caothap")
				}),
				arb: result[4].filter(function(arb){
					return (arb.game == "arb")
				})
			}};
			io.broadcast(temp_data);
		})
	});
}
function setTaiXiu_user(phien, dice){
	TXCuocOne.find({phien: phien}, {}, function(err, list) {
		if (list.length){
			Promise.all(list.map(function(obj){
				var action = new Promise((resolve, reject)=> {
					TaiXiu_User.findOne({uid: obj.uid}, function(error, data) {
						var bet_thua = obj.bet-obj.tralai;
						var bet = obj.win ? obj.betwin+obj.bet : bet_thua;
						if (obj.taixiu == true && obj.red == true){          // Red Tài Xỉu
							var update = {
								tLineWinRed:   obj.win && data.tLineWinRed < data.tLineWinRedH+1 ? data.tLineWinRedH+1 : data.tLineWinRed,
								tLineLostRed:  !obj.win && data.tLineLostRed < data.tLineLostRedH+1 ? data.tLineLostRedH+1 : data.tLineLostRed,
								tLineWinRedH:  obj.win ? data.tLineWinRedH+1 : 0,
								tLineLostRedH: obj.win ? 0 : data.tLineLostRedH+1,
								tBigWinRed:    obj.win && data.tBigWinRed < obj.betwin ? obj.betwin : data.tBigWinRed,
								tBigLostRed:   !obj.win && data.tBigLostRed < bet_thua ? bet_thua : data.tBigLostRed
							};
						} else if (obj.taixiu == true && obj.red == false) { // Xu Tài Xỉu
							var update = {
								tLineWinXu:   obj.win && data.tLineWinXu < data.tLineWinXuH+1 ? data.tLineWinXuH+1 : data.tLineWinXu,
								tLineLostXu:  !obj.win && data.tLineLostXu < data.tLineLostXuH+1 ? data.tLineLostXuH+1 : data.tLineLostXu,
								tLineWinXuH:  obj.win ? data.tLineWinXuH+1 : 0,
								tLineLostXuH: obj.win ? 0 : data.tLineLostXuH+1,
								tBigWinXu:    obj.win && data.tBigWinXu < obj.betwin ? obj.betwin : data.tBigWinXu,
								tBigLostXu:   !obj.win && data.tBigLostXu < bet_thua ? bet_thua : data.tBigLostXu
							}
						} else if (obj.taixiu == false && obj.red == true) { // Red Chẵn Lẻ
							var update = {
								cLineWinRed:   obj.win && data.cLineWinRed < data.cLineWinRedH+1 ? data.cLineWinRedH+1 : data.cLineWinRed,
								cLineLostRed:  !obj.win && data.cLineLostRed < data.cLineLostRedH+1 ? data.cLineLostRedH+1 : data.cLineLostRed,
								cLineWinRedH:  obj.win ? data.cLineWinRedH+1 : 0,
								cLineLostRedH: obj.win ? 0 : data.cLineLostRedH+1,
								cBigWinRed:    obj.win && data.cBigWinRed < obj.betwin ? obj.betwin : data.cBigWinRed,
								cBigLostRed:   !obj.win && data.cBigLostRed < bet_thua ? bet_thua : data.cBigLostRed,
							}
						} else if (obj.taixiu == false && obj.red == false) { // Xu Chẵn Lẻ
							var update = {
								cLineWinXu:   obj.win && data.cLineWinXu < data.cLineWinXuH+1 ? data.cLineWinXuH+1 : data.cLineWinXu,
								cLineLostXu:  !obj.win && data.cLineLostXu < data.cLineLostXuH+1 ? data.cLineLostXuH+1 : data.cLineLostXu,
								cLineWinXuH:  obj.win ? data.cLineWinXuH+1 : 0,
								cLineLostXuH: obj.win ? 0 : data.cLineLostXuH+1,
								cBigWinXu:    obj.win && data.cBigWinXu < obj.betwin ? obj.betwin : data.cBigWinXu,
								cBigLostXu:   !obj.win && data.cBigLostXu < bet_thua ? bet_thua : data.cBigLostXu
							}
						}

						TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$set:update}).exec();

						if(void 0 !== io.users[obj.uid]){
							Promise.all(io.users[obj.uid].map(function(client){
								client.red({taixiu:{status:{win:obj.win, thuong:obj.thuong, select:obj.select, bet: bet}}});
							}));
						}

						resolve({uid: obj.uid, red: obj.red, taixiu:obj.taixiu, bet: obj.bet, betwin: obj.betwin});
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
						Promise.all(results.map(function(obj){
							var action = new Promise((resolve, reject) => {
								UserInfo.findOne({id: obj.uid}, 'name', function(err, users){
									if (obj.taixiu) {
										resolve('<color=#FFFF00>' + users.name + '</color><color=#FFFFFF> thắng </color><color=#FFFF00>' + Helpers.numberWithCommas(obj.betwin+obj.bet) + '</color><color=#FFFFFF> game </color><color=#52FF00>Tài Xỉu</color>');
									}else{
										resolve('<color=#FFFF00>' + users.name + '</color><color=#FFFFFF> thắng </color><color=#FFFF00>' + Helpers.numberWithCommas(obj.betwin+obj.bet) + '</color><color=#FFFFFF> game </color><color=#52FF00>Chẵn Lẻ</color>');
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

function thongtin_thanhtoan(game_id, dice = false){

	TaiXiu_red_tong_tai   = 0;
	TaiXiu_red_tong_xiu   = 0;
	taixiu_red_player_tai = 0;
	taixiu_red_player_xiu = 0;
	taixiu_red_player_tai_temp = [];
	taixiu_red_player_xiu_temp = [];

	TaiXiu_xu_tong_tai   = 0;
	TaiXiu_xu_tong_xiu   = 0;
	taixiu_xu_player_tai = 0;
	taixiu_xu_player_xiu = 0;
	taixiu_xu_player_tai_temp = [];
	taixiu_xu_player_xiu_temp = [];

	ChanLe_red_tong_chan   = 0;
	ChanLe_red_tong_le     = 0;
	chanle_red_player_chan = 0;
	chanle_red_player_le   = 0;
	chanle_red_player_chan_temp = [];
	chanle_red_player_le_temp   = [];

	ChanLe_xu_tong_chan   = 0;
	ChanLe_xu_tong_le     = 0;
	chanle_xu_player_chan = 0;
	chanle_xu_player_le   = 0;
	chanle_xu_player_chan_temp = [];
	chanle_xu_player_le_temp   = [];

	TXCuoc.find({phien:game_id}, null, {sort:{'id':-1}}, function(err, list) {
		//if(list.length>0){
		if(list.length){
			Promise.all(list.map(function(obj){
				if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
					TaiXiu_red_tong_tai += obj.bet;
					if(taixiu_red_player_tai_temp[obj.name] === void 0) taixiu_red_player_tai_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
					TaiXiu_red_tong_xiu += obj.bet;
					if(taixiu_red_player_xiu_temp[obj.name] === void 0) taixiu_red_player_xiu_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
					TaiXiu_xu_tong_tai += obj.bet;
					if(taixiu_xu_player_tai_temp[obj.name] === void 0) taixiu_xu_player_tai_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
					TaiXiu_xu_tong_xiu += obj.bet;
					if(taixiu_xu_player_xiu_temp[obj.name] === void 0) taixiu_xu_player_xiu_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
					ChanLe_red_tong_chan += obj.bet;
					if(chanle_red_player_chan_temp[obj.name] === void 0) chanle_red_player_chan_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
					ChanLe_red_tong_le += obj.bet;
					if(chanle_red_player_le_temp[obj.name] === void 0) chanle_red_player_le_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
					ChanLe_xu_tong_chan += obj.bet;
					if(chanle_xu_player_chan_temp[obj.name] === void 0) chanle_xu_player_chan_temp[obj.name] = 1;
					var test = "MrT"
				} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
					ChanLe_xu_tong_le += obj.bet;
					if(chanle_xu_player_le_temp[obj.name] === void 0) chanle_xu_player_le_temp[obj.name] = 1;
					var test = "MrT"
				}
				return test
			}))
			.then(function(arrayOfResults) {
				if (dice) {
					var TaiXiu_tong_red_lech = Math.abs(TaiXiu_red_tong_tai  - TaiXiu_red_tong_xiu);
					var TaiXiu_tong_xu_lech  = Math.abs(TaiXiu_xu_tong_tai   - TaiXiu_xu_tong_xiu);
					var ChanLe_tong_red_lech = Math.abs(ChanLe_red_tong_chan - ChanLe_red_tong_le);
					var ChanLe_tong_xu_lech  = Math.abs(ChanLe_xu_tong_chan  - ChanLe_xu_tong_le);

					var TaiXiu_red_lech_tai  = TaiXiu_red_tong_tai  > TaiXiu_red_tong_xiu ? true : false;
					var TaiXiu_xu_lech_tai   = TaiXiu_xu_tong_tai   > TaiXiu_xu_tong_xiu  ? true : false;
					var ChanLe_red_lech_chan = ChanLe_red_tong_chan > ChanLe_red_tong_le  ? true : false;
					var ChanLe_xu_lech_chan  = ChanLe_xu_tong_chan  > ChanLe_xu_tong_le   ? true : false;

					Promise.all(list.map(function(obj){
						var userUpdate = {};
						var oneUpdate  = {};
						if (obj.taixiu == true && obj.red == true && obj.select == true){           // Tổng Red Tài
							var win = dice > 10 ? true : false;
							if (TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
								if (TaiXiu_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_red_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-TaiXiu_tong_red_lech;
									var betwinT = truChietKhau(betwin, 2);
									var betwinP = win ? betwinT : 0;
									userUpdate['red'] = TaiXiu_tong_red_lech;
									//var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:TaiXiu_tong_red_lech}}).exec();
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										userUpdate['redWin'] = betwinT;
										userUpdate['red']   += betwin+betwinT;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinRed:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostRed:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_red_lech}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_red_lech, betwin:betwinP}}).exec();
									// code cập nhật tiền trả lại
									TaiXiu_tong_red_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin           = truChietKhau(obj.bet, 2);
									userUpdate['red']    = obj.bet+betwin;
									userUpdate['redWin'] = betwin;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinRed:betwin}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostRed:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == true && obj.red == true && obj.select == false) {  // Tổng Red Xỉu
							var win = dice > 10 ? false : true;
							if (!TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
								if (TaiXiu_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_red_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-TaiXiu_tong_red_lech;
									var betwinT = truChietKhau(betwin, 2);
									var betwinP = win ? betwinT : 0;
									userUpdate['red'] = TaiXiu_tong_red_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										userUpdate['redWin'] = betwinT;
										userUpdate['red']   += betwin+betwinT;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinRed:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostRed:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_red_lech}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:TaiXiu_tong_red_lech, betwin:betwinP}}).exec();
									// code cập nhật tiền trả lại
									TaiXiu_tong_red_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin           = truChietKhau(obj.bet, 2);
									userUpdate['red']    = obj.bet+betwin;
									userUpdate['redWin'] = betwin;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinRed:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostRed:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == true && obj.red == false && obj.select == true) {  // Tổng Xu Tài
							var win = dice > 10 ? true : false;
							if (TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
								if (TaiXiu_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_xu_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-TaiXiu_tong_xu_lech;
									var betwinT = truChietKhau(betwin, 4);
									var betwinP = win ? betwinT : 0;
									userUpdate['xu'] = TaiXiu_tong_xu_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										var thuong = (betwinT*0.039589)>>0;
										userUpdate['xu']   += betwin+betwinT;
										userUpdate['xuWin'] = betwinT;
										userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinXu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostXu:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_xu_lech}}).exec();
									oneUpdate['tralai'] = TaiXiu_tong_xu_lech;
									oneUpdate['betwin'] = betwinP;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// code cập nhật tiền trả lại
									TaiXiu_tong_xu_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin          = truChietKhau(obj.bet, 4);
									userUpdate['xu']    = obj.bet+betwin;
									userUpdate['xuWin'] = betwin;
									var thuong = (betwin*0.039589)>>0;
									userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinXu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostXu:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == true && obj.red == false && obj.select == false) { // Tổng Xu Xỉu
							var win = dice > 10 ? false : true;
							if (!TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
								if (TaiXiu_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									TaiXiu_tong_xu_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-TaiXiu_tong_xu_lech;
									var betwinT = truChietKhau(betwin, 4);
									var betwinP = win ? betwinT : 0;
									userUpdate['xu'] = TaiXiu_tong_xu_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										var thuong = (betwinT*0.039589)>>0;
										userUpdate['xu']   += betwin+betwinT;
										userUpdate['xuWin'] = betwinT;
										userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinXu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostXu:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:TaiXiu_tong_xu_lech}}).exec();
									oneUpdate['tralai'] = TaiXiu_tong_xu_lech;
									oneUpdate['betwin'] = betwinP;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// code cập nhật tiền trả lại
									TaiXiu_tong_xu_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin          = truChietKhau(obj.bet, 4);
									userUpdate['xu']    = obj.bet+betwin;
									userUpdate['xuWin'] = betwin;
									var thuong = (betwin*0.039589)>>0;
									userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tWinXu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{tLostXu:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == false && obj.red == true && obj.select == true) {  // Tổng Red Chẵn
							var win = dice%2 ? false : true;
							if (ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
								if (ChanLe_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_red_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-ChanLe_tong_red_lech;
									var betwinT = truChietKhau(betwin, 2);
									var betwinP = win ? betwinT : 0;
									userUpdate['red'] = ChanLe_tong_red_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										userUpdate['redWin'] = betwinT;
										userUpdate['red']   += betwin+betwinT;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinRed:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostRed:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin: betwinP, tralai:ChanLe_tong_red_lech}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_red_lech, betwin:betwinP}}).exec();
									// code cập nhật tiền trả lại
									ChanLe_tong_red_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin  = truChietKhau(obj.bet, 2);
									userUpdate['redWin'] = betwin;
									userUpdate['red']    = obj.bet+betwin;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinRed:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostRed:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == false && obj.red == true && obj.select == false) {  // Tổng Red Lẻ
							var win = dice%2 ? true : false;
							if (!ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
								if (ChanLe_tong_red_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_red_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-ChanLe_tong_red_lech;
									var betwinT = truChietKhau(betwin, 2);
									var betwinP = win ? betwinT : 0;
									userUpdate['red'] = ChanLe_tong_red_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										userUpdate['redWin'] = betwinT;
										userUpdate['red']   += betwin+betwinT;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinRed:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostRed:betwin}}).exec();
									}
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:ChanLe_tong_red_lech}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:ChanLe_tong_red_lech, betwin:betwinP}}).exec();
									// code cập nhật tiền trả lại
									ChanLe_tong_red_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin  = truChietKhau(obj.bet, 2);
									userUpdate['redWin'] = betwin;
									userUpdate['red']    = obj.bet+betwin;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinRed:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost': obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostRed:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == false && obj.red == false && obj.select == true) {  // Tổng xu Chẵn
							var win = dice%2 ? false : true;
							if (ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
								if (ChanLe_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_xu_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-ChanLe_tong_xu_lech;
									var betwinT = truChietKhau(betwin, 4);
									var betwinP = win ? betwinT : 0;
									userUpdate['xu'] = ChanLe_tong_xu_lech;
									if (win) {
										// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										var thuong = (betwinT*0.039589)>>0;
										userUpdate['xu']   += betwin+betwinT;
										userUpdate['xuWin'] = betwinT;
										userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinXu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostXu:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:ChanLe_tong_xu_lech}}).exec();
									oneUpdate['tralai'] = ChanLe_tong_xu_lech;
									oneUpdate['betwin'] = betwinP;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// code cập nhật tiền trả lại
									ChanLe_tong_xu_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin          = truChietKhau(obj.bet, 4);
									userUpdate['xu']    = obj.bet+betwin;
									userUpdate['xuWin'] = betwin;
									var thuong = (betwin*0.039589)>>0;
									userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinXu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost': obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostXu:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						} else if (obj.taixiu == false && obj.red == false && obj.select == false) { // Tổng xu Lẻ
							var win = dice%2 ? true : false;
							if (!ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
								if (ChanLe_tong_xu_lech >= obj.bet) {
									// Trả lại hoàn toàn
									ChanLe_tong_xu_lech -= obj.bet
									// code trả lại hoàn toàn
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, tralai:obj.bet}}).exec();
									var active3 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
									return Promise.all([active1, active2, active3])
								}else{
									// Trả lại 1 phần
									// code trả lại 1 phần
									var betwin  = obj.bet-ChanLe_tong_xu_lech;
									var betwinT = truChietKhau(betwin, 4);
									var betwinP = win ? betwinT : 0;
									userUpdate['xu'] = ChanLe_tong_xu_lech;
									if (win) {
									// Thắng nhưng bị trừ tiền trả lại
										// code cộng tiền thắng
										var thuong = (betwinT*0.039589)>>0;
										userUpdate['xu']   += betwin+betwinT;
										userUpdate['xuWin'] = betwinT;
										userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinXu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostXu:betwin}}).exec();
									}
									var active2 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:win, betwin:betwinP, tralai:ChanLe_tong_xu_lech}}).exec();
									oneUpdate['tralai'] = ChanLe_tong_xu_lech;
									oneUpdate['betwin'] = betwinP;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
									// code cập nhật tiền trả lại
									ChanLe_tong_xu_lech = 0;
									return Promise.all([active1, active2, active3, active4])
								}
							}else{
								if (win) {
									// code cộng tiền thắng hoàn toàn
									var betwin          = truChietKhau(obj.bet, 4);
									userUpdate['xu']    = obj.bet+betwin;
									userUpdate['xuWin'] = betwin;
									var thuong = (betwin*0.039589)>>0;
									userUpdate['red']   = userUpdate['thuong'] = oneUpdate['thuong'] = thuong;
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:userUpdate}).exec();
									var active2 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:obj.bet}}).exec();
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cWinXu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{cLostXu:obj.bet}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true}}).exec();
									return Promise.all([active1, active2, active3])
								}
							}
						}
						return 1
					}))
					.then(function(arrayOfResults) {
						//Promise.all(arrayOfResults).then(function(data){
							playGame()
							setTaiXiu_user(game_id, dice)
						//})
					});
				}else{
					var home = {taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu}}};
					var temp_data = {taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu,xu_tai: TaiXiu_xu_tong_tai,xu_xiu: TaiXiu_xu_tong_xiu,red_player_tai: Object.keys(taixiu_red_player_tai_temp).length,red_player_xiu: Object.keys(taixiu_red_player_xiu_temp).length,xu_player_tai: Object.keys(taixiu_xu_player_tai_temp).length,xu_player_xiu: Object.keys(taixiu_xu_player_xiu_temp).length,},chanle:{red_chan: ChanLe_red_tong_chan,red_le: ChanLe_red_tong_le,xu_chan: ChanLe_xu_tong_chan,xu_le: ChanLe_xu_tong_le,red_player_chan: Object.keys(chanle_red_player_chan_temp).length,red_player_le: Object.keys(chanle_red_player_le_temp).length,xu_player_chan: Object.keys(chanle_xu_player_chan_temp).length,xu_player_le: Object.keys(chanle_xu_player_le_temp).length}}};

					Promise.all(Object.values(io.users).map(function(users){
						Promise.all(users.map(function(client){
							if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
								client.red(temp_data);
							}else if(client.scene == "home"){
								client.red(home);
							}
						}));
					}));

					var temp_dataA = {taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu,xu_tai: TaiXiu_xu_tong_tai,xu_xiu: TaiXiu_xu_tong_xiu,red_player_tai: Object.keys(taixiu_red_player_tai_temp).length,red_player_xiu: Object.keys(taixiu_red_player_xiu_temp).length,xu_player_tai: Object.keys(taixiu_xu_player_tai_temp).length,xu_player_xiu: Object.keys(taixiu_xu_player_xiu_temp).length,},chanle:{red_chan: ChanLe_red_tong_chan,red_le: ChanLe_red_tong_le,xu_chan: ChanLe_xu_tong_chan,xu_le: ChanLe_xu_tong_le,red_player_chan: Object.keys(chanle_red_player_chan_temp).length,red_player_le: Object.keys(chanle_red_player_le_temp).length,xu_player_chan: Object.keys(chanle_xu_player_chan_temp).length,xu_player_le: Object.keys(chanle_xu_player_le_temp).length}, list:list}};

					Promise.all(Object.values(io.admins).map(function(admin){
						Promise.all(admin.map(function(client){
							if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu)
								client.red(temp_dataA); // list
						}));
					}));

					if (!(io.TaiXiu_time%10)) {
						// Khách
						io.sendAllClient(home);
					}
				}
			}, reason => {
			});
		}else if (dice) {
			playGame();
		}
	});
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
						console.log(create.id);
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
			}else
				thongtin_thanhtoan(io.TaiXiu_phien)
		}
	}, 1000)
	return gameLoop
}

module.exports = init;
