
const UserInfo    = require('../../Models/UserInfo');

const TXPhien     = require('../../Models/TaiXiu_phien');
const TXCuoc      = require('../../Models/TaiXiu_cuoc');
const TXChat      = require('../../Models/TaiXiu_chat');
const TaiXiu_User = require('../../Models/TaiXiu_user');

module.exports = function(client){
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
		TXChat.find({},'name value id', {sort:{'id':-1}, limit: 20}, function(err, post) {
			if (err) return reject(err)
			Promise.all(post.map(function(obj){return {'user':obj.name, 'value':obj.value}}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});
	var active3 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, {}, function(err, user){
			username = user.name;
			TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
				if (last !== null){
					var phien = last.id+1;

					TXCuoc.find({phien:phien}, async function(err, list) {
						//console.log(list)
						var cuoc_data = new Promise((resolveT, reject) => {
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
								resolveT(arrayOfResults)
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
								resolve(user)
							})
						}, reason => {
							console.log(reason)
						});
					});
				}
			});
		});
	});

	var active4 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid: client.UID}, 't_day_thang_red t_day_thua_red t_day_thang_xu t_day_thua_xu c_day_thang_red c_day_thua_red c_day_thang_xu c_day_thua_xu t_day_thang_red_ht t_day_thua_red_ht t_day_thang_xu_ht t_day_thua_xu_ht c_day_thang_red_ht c_day_thua_red_ht c_day_thang_xu_ht c_day_thua_xu_ht', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2, active3, active4]).then(values => {
		client.send(JSON.stringify({
			//user: values[2],
			taixiu:{time_remain: client.redT.TaiXiu_time, du_day: values[3], logs: values[0], chat:{logs: values[1].reverse()}, taixiu:{ red_tai: TaiXiu_red_tong_tai, red_xiu: TaiXiu_red_tong_xiu, xu_tai: TaiXiu_xu_tong_tai, xu_xiu: TaiXiu_xu_tong_xiu, red_me_tai: TaiXiu_red_me_tai, red_me_xiu: TaiXiu_red_me_xiu, xu_me_tai: TaiXiu_xu_me_tai, xu_me_xiu: TaiXiu_xu_me_xiu, red_player_tai: taixiu_red_player_tai, red_player_xiu: taixiu_red_player_xiu, xu_player_tai: taixiu_xu_player_tai, xu_player_xiu: taixiu_xu_player_xiu, }, chanle:{ red_chan: ChanLe_red_tong_chan, red_le: ChanLe_red_tong_le, xu_chan: ChanLe_xu_tong_chan, xu_le: ChanLe_xu_tong_le, red_me_chan: ChanLe_red_me_chan, red_me_le: ChanLe_red_me_le, xu_me_chan: ChanLe_xu_me_chan, xu_me_le: ChanLe_xu_me_le, red_player_chan: chanle_red_player_chan, red_player_le: chanle_red_player_le, xu_player_chan: chanle_xu_player_chan, xu_player_le: chanle_xu_player_le}},
			mini:  {baucua:{time_remain: client.redT.BauCua_time}}
		}));
	}, reason => {
		console.log(reason)
	});
}
