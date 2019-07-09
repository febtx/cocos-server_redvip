
const fs          = require('fs');

const Helpers     = require('../Helpers/Helpers');

const UserInfo    = require('../Models/UserInfo')
const TXPhien     = require('../Models/TaiXiu_phien')
const TXCuoc      = require('../Models/TaiXiu_cuoc')
const TaiXiu_User = require('../Models/TaiXiu_user');
const TXCuocOne   = require('../Models/TaiXiu_one');

// Hũ game
const miniPokerHu     = require('../Models/miniPoker/miniPokerHu');
const BigBabol_hu     = require('../Models/BigBabol/BigBabol_hu');
const Mini3Cay_hu     = require('../Models/Mini3Cay/Mini3Cay_hu');
const VuongQuocRed_hu = require('../Models/VuongQuocRed/VuongQuocRed_hu');

const dataTaiXiu = '../../data/taixiu.json';
var io       = null
var phien    = 1
var gameLoop = null

function init(obj){
	io = obj;
	playGame();
}

TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (!!last){
		phien = last.id+1;
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

	Promise.all([active1, active2, active3, active4]).then(result => {
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
			var temp_data = JSON.stringify({TopHu: {mini_poker: result[0], big_babol: result[1], vq_red: result[2], mini3cay: result[3]}});
			Promise.all(Object.values(io.users).map(function(users){
				Promise.all(users.map(function(client){
					client.send(temp_data);
				}));
			}));
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
								t_day_thang_red:    obj.win && data.t_day_thang_red < data.t_day_thang_red_ht+1 ? data.t_day_thang_red_ht+1 : data.t_day_thang_red,
								t_day_thua_red:    !obj.win && data.t_day_thua_red < data.t_day_thua_red_ht+1 ? data.t_day_thua_red_ht+1 : data.t_day_thua_red,
								t_day_thang_red_ht: obj.win ? data.t_day_thang_red_ht+1 : 0,
								t_day_thua_red_ht:  obj.win ? 0 : data.t_day_thua_red_ht+1,
								t_thang_lon_red:    obj.win && data.t_thang_lon_red < obj.betwin ? obj.betwin : data.t_thang_lon_red,
								t_thua_lon_red:    !obj.win && data.t_thua_lon_red < bet_thua ? bet_thua : data.t_thua_lon_red
							};
						} else if (obj.taixiu == true && obj.red == false) { // Xu Tài Xỉu
							var update = {
								t_day_thang_xu:    obj.win && data.t_day_thang_xu < data.t_day_thang_xu_ht+1 ? data.t_day_thang_xu_ht+1 : data.t_day_thang_xu,
								t_day_thua_xu:    !obj.win && data.t_day_thua_xu < data.t_day_thua_xu_ht+1 ? data.t_day_thua_xu_ht+1 : data.t_day_thua_xu,
								t_day_thang_xu_ht: obj.win ? data.t_day_thang_xu_ht+1 : 0,
								t_day_thua_xu_ht:  obj.win ? 0 : data.t_day_thua_xu_ht+1,
								t_thang_lon_xu:    obj.win && data.t_thang_lon_xu < obj.betwin ? obj.betwin : data.t_thang_lon_xu,
								t_thua_lon_xu:    !obj.win && data.t_thua_lon_xu < bet_thua ? bet_thua : data.t_thua_lon_xu
							}
						} else if (obj.taixiu == false && obj.red == true) { // Red Chẵn Lẻ
							var update = {
								c_day_thang_red:    obj.win && data.c_day_thang_red < data.c_day_thang_red_ht+1 ? data.c_day_thang_red_ht+1 : data.c_day_thang_red,
								c_day_thua_red:     !obj.win && data.c_day_thua_red < data.c_day_thua_red_ht+1 ? data.c_day_thua_red_ht+1 : data.c_day_thua_red,
								c_day_thang_red_ht: obj.win ? data.c_day_thang_red_ht+1 : 0,
								c_day_thua_red_ht:  obj.win ? 0 : data.c_day_thua_red_ht+1,
								c_thang_lon_red:    obj.win && data.c_thang_lon_red < obj.betwin ? obj.betwin : data.c_thang_lon_red,
								c_thua_lon_red:     !obj.win && data.c_thua_lon_red < bet_thua ? bet_thua : data.c_thua_lon_red,
							}
						} else if (obj.taixiu == false && obj.red == false) { // Xu Chẵn Lẻ
							var update = {
								c_day_thang_xu:    obj.win && data.c_day_thang_xu < data.c_day_thang_xu_ht+1 ? data.c_day_thang_xu_ht+1 : data.c_day_thang_xu,
								c_day_thua_xu:     !obj.win && data.c_day_thua_xu < data.c_day_thua_xu_ht+1 ? data.c_day_thua_xu_ht+1 : data.c_day_thua_xu,
								c_day_thang_xu_ht: obj.win ? data.c_day_thang_xu_ht+1 : 0,
								c_day_thua_xu_ht:  obj.win ? 0 : data.c_day_thua_xu_ht+1,
								c_thang_lon_xu:    obj.win && data.c_thang_lon_xu < obj.betwin ? obj.betwin : data.c_thang_lon_xu,
								c_thua_lon_xu:     !obj.win && data.c_thua_lon_xu < bet_thua ? bet_thua : data.c_thua_lon_xu
							}
						}

						TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$set:update}).exec();

						if(void 0 !== io.users[obj.uid]){
							Promise.all(io.users[obj.uid].map(function(client){
								client.send(JSON.stringify({taixiu:{status:{win:obj.win, thuong:obj.thuong, select:obj.select, bet: bet}}}));
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
							Promise.all(Object.values(io.users).map(function(users){
								Promise.all(users.map(function(client){
									if(client.scene == "home"){
										client.send(JSON.stringify({news:{a:result}}));
									}
								}));
							}));
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:betwin}}).exec();
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
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwin}}).exec();
									var active3 = TXCuoc.findOneAndUpdate({_id:obj._id}, {$set:{thanhtoan: true, win:true, betwin:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_red:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_red:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thang_xu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{t_tong_thua_xu:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwinT}}).exec();
									}else{
										userUpdate['redLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_red:betwin}}).exec();
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'redLost': obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_red:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost': obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:obj.bet}}).exec();
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
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:betwinT}}).exec();
									}else{
										userUpdate['xuLost'] = betwin;
										var active1 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:betwin}}).exec();
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
									var active3 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thang_xu:obj.bet}}).exec();
									oneUpdate['betwin'] = betwin;
									var active4 = TXCuocOne.findOneAndUpdate({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
									return Promise.all([active1, active2, active3, active4])
								}else{
									var active1 = UserInfo.findOneAndUpdate({id:obj.uid}, {$inc:{'xuLost':obj.bet}}).exec();
									var active2 = TaiXiu_User.findOneAndUpdate({uid: obj.uid}, {$inc:{c_tong_thua_xu:obj.bet}}).exec();
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
					var temp_data = JSON.stringify({taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu,xu_tai: TaiXiu_xu_tong_tai,xu_xiu: TaiXiu_xu_tong_xiu,red_player_tai: Object.keys(taixiu_red_player_tai_temp).length,red_player_xiu: Object.keys(taixiu_red_player_xiu_temp).length,xu_player_tai: Object.keys(taixiu_xu_player_tai_temp).length,xu_player_xiu: Object.keys(taixiu_xu_player_xiu_temp).length,},chanle:{red_chan: ChanLe_red_tong_chan,red_le: ChanLe_red_tong_le,xu_chan: ChanLe_xu_tong_chan,xu_le: ChanLe_xu_tong_le,red_player_chan: Object.keys(chanle_red_player_chan_temp).length,red_player_le: Object.keys(chanle_red_player_le_temp).length,xu_player_chan: Object.keys(chanle_xu_player_chan_temp).length,xu_player_le: Object.keys(chanle_xu_player_le_temp).length}}});
					Promise.all(Object.values(io.users).map(function(users){
						Promise.all(users.map(function(client){
							if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
								client.send(temp_data);
							}else if(client.scene == "home"){
								client.send(JSON.stringify({taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu}}}));
							}
						}));
					}));
					Promise.all(Object.values(io.admins).map(function(admin){
						Promise.all(admin.map(function(client){
							if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu)
								client.send(temp_data);
						}));
					}));
				}
			}, reason => {
				console.log(reason)
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

	gameLoop = setInterval(async function(){
		//console.log(io.TaiXiu_time);
		if (!(io.TaiXiu_time%5)) {
			// Hũ
			TopHu();
		}
		io.TaiXiu_time--;
		//console.log(io.TaiXiu_time);
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

				fs.writeFile(dataTaiXiu, JSON.stringify(file), function(err){});

				try {
					const create = await TXPhien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()})
					if (!!create) {
						phien = create.id+1
						var chothanhtoan = await thongtin_thanhtoan(create.id, dice1+dice2+dice3);

						Promise.all(Object.values(io.users).map(function(users){
							Promise.all(users.map(function(client){
								client.send(JSON.stringify({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}}));
							}));
						}));

						Promise.all(Object.values(io.admins).map(function(admin){
							Promise.all(admin.map(function(client){
								client.send(JSON.stringify({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}}));
							}));
						}));
					}
				} catch (err) {
					console.log(err)
				}
			}else
				thongtin_thanhtoan(phien)
		}

	}, 1000)
	return gameLoop
}

module.exports = init;
