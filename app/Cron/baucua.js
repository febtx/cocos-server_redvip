
const fs          = require('fs');

const Helpers     = require('../Helpers/Helpers');

const UserInfo     = require('../Models/UserInfo');
const BauCua_phien = require('../Models/BauCua/BauCua_phien');
const BauCua_cuoc  = require('../Models/BauCua/BauCua_cuoc');
const BauCua_user  = require('../Models/BauCua/BauCua_user');
const BauCua_temp  = require('../Models/BauCua/BauCua_temp');

const dataBauCua = '../../data/baucua.json';

var io       = null;
var gameLoop = null;

function init(obj){
	io = obj;
	io.BauCua_phien = 1;

	BauCua_phien.findOne({}, 'id', {sort:{'_id':-1}}, function(err, last) {
		if (!!last){
			io.BauCua_phien = last.id+1;
		}
		playGame();
	})
}

function thongtin_thanhtoan(dice = null){
	BauCua_temp.findOne({}, {}, function(err, temp){
		if (!!dice) {
			var heSo   = {}; // Hệ số nhân
			for (var i = 0; i < 3; i++) {
				var dataT = dice[i];
				if (void 0 === heSo[dataT]) {
					heSo[dataT] = 1;
				}else{
					heSo[dataT] += 1;
				}
			}
			var updateLog = {};
			for (var j = 0; j < 6; j++) {
				if (void 0 !== heSo[j]) {
					updateLog[j] = heSo[j];
				}
			}
			var phien = io.BauCua_phien-1;
			BauCua_temp.findOneAndUpdate({'_id': temp._id}, {$inc: updateLog, $set:{'red.0': 0, 'red.1': 0, 'red.2': 0, 'red.3': 0, 'red.4': 0, 'red.5': 0, 'xu.0': 0, 'xu.1': 0, 'xu.2': 0, 'xu.3': 0, 'xu.4': 0, 'xu.5': 0}}, function(err,cat){});
			BauCua_cuoc.find({phien: phien}, {}, function(err, list) {
				if (list.length) {
					Promise.all(list.map(function(cuoc){
						var phe = cuoc.red ? 2 : 4; // Phế
						var TienThang = 0; // Số tiền thắng (chưa tính gốc)
						var TongThua  = 0; // Số tiền thua
						var TongThang = 0; // Tổng tiền thắng (đã tính gốc)
						var thuong    = 0;
						var huou      = 0;
						var bau       = 0;
						var ga        = 0;
						var ca        = 0;
						var cua       = 0;
						var tom       = 0;

						// Cược Hươu
						if (cuoc[0] > 0) {
							if (void 0 !== heSo[0]) {
								huou = (cuoc[0]*heSo[0]);
								huou = huou-Math.ceil(huou*phe/100);
								TienThang += huou;
								TongThang += cuoc[0]+huou;
							}else{
								TongThua  += cuoc[0];
							}
						}
						// Cược Bầu
						if (cuoc[1] > 0) {
							if (void 0 !== heSo[1]) {
								bau = (cuoc[1]*heSo[1]);
								bau = bau-Math.ceil(bau*phe/100);
								TienThang += bau;
								TongThang += cuoc[1]+bau;
							}else{
								TongThua  += cuoc[1];
							}
						}
						// Cược Gà
						if (cuoc[2] > 0) {
							if (void 0 !== heSo[2]) {
								ga = (cuoc[2]*heSo[2]);
								ga = ga-Math.ceil(ga*phe/100);
								TienThang += ga;
								TongThang += cuoc[2]+ga;
							}else{
								TongThua  += cuoc[2];
							}
						}
						// Cược Cá
						if (cuoc[3] > 0) {
							if (void 0 !== heSo[3]) {
								ca = (cuoc[3]*heSo[3]);
								ca = ca-Math.ceil(ca*phe/100);
								TienThang += ca;
								TongThang += cuoc[3]+ca;
							}else{
								TongThua  += cuoc[3];
							}
						}
						// Cược Cua
						if (cuoc[4] > 0) {
							if (void 0 !== heSo[4]) {
								cua = (cuoc[4]*heSo[4]);
								cua = cua-Math.ceil(cua*phe/100);
								TienThang += cua;
								TongThang += cuoc[4]+cua;
							}else{
								TongThua  += cuoc[4];
							}
						}
						// Cược Tôm
						if (cuoc[5] > 0) {
							if (void 0 !== heSo[5]) {
								tom = (cuoc[5]*heSo[5]);
								tom = tom-Math.ceil(tom*phe/100);
								TienThang += tom;
								TongThang += cuoc[5]+tom;
							}else{
								TongThua  += cuoc[5];
							}
						}

						var update     = {};
						var updateGame = {};

						if (cuoc.red) {
							//RED
							if (TongThang > 0) {
								update['red'] = TongThang;
							}
							if (TienThang > 0) {
								update['redWin'] = updateGame['red'] = TienThang;
							}
							if (TongThua > 0) {
								update['redLost'] = updateGame['red_lost'] = TongThua;
							}

							var active1 = UserInfo.findOneAndUpdate({id:cuoc.uid}, {$inc:update}).exec();
							var active2 = BauCua_cuoc.findOneAndUpdate({_id:cuoc._id}, {$set:{thanhtoan: true, betwin:TongThang}}).exec();
							var active3 = BauCua_user.findOneAndUpdate({uid: cuoc.uid}, {$inc:updateGame}).exec();
						}else{
							//XU
							if (TongThang > 0) {
								update['xu'] = TongThang;
							}
							if (TienThang > 0) {
								thuong = (TienThang*0.039589)>>0;
								update['xuWin'] = updateGame['xu'] = TienThang;
								update['red']   = update['thuong'] = updateGame['thuong'] = thuong;
							}
							if (TongThua > 0) {
								update['xuLost'] = updateGame['xu_lost'] = TongThua;
							}

							var active1 = UserInfo.findOneAndUpdate({id:cuoc.uid}, {$inc:update}).exec();
							var active2 = BauCua_cuoc.findOneAndUpdate({_id:cuoc._id}, {$set:{thanhtoan: true, betwin:TongThang}}).exec();
							var active3 = BauCua_user.findOneAndUpdate({uid: cuoc.uid}, {$inc:updateGame}).exec();
						}
						if(void 0 !== io.users[cuoc.uid]){
							if (TongThang > 0) {
								var status = {mini:{baucua:{status:{win:true, bet: TongThang, thuong: thuong}}}};
							}else{
								var status = {mini:{baucua:{status:{win:false, bet: TongThua}}}};
							}
							Promise.all(io.users[cuoc.uid].map(function(client){
								client.red(status);
							}));
						}
						return Promise.all([active1, active2, active3])
							.then(values => {
								if (values[1].red && TongThang > 0) {
									return '<color=#FFFF00>' + values[0].name + '</color><color=#FFFFFF> thắng </color><color=#FFFF00>' + Helpers.numberWithCommas(TongThang) + '</color><color=#FFFFFF> game </color><color=#52FF00>Bầu Cua</color>';
								}
								return void 0;
							});
					}))
					.then(function(arrayOfResults) {
							Promise.all(arrayOfResults.filter(function(st){
								return st !== void 0
							}))
							.then(result => {
								if (result.length>0) {
									result = {news:{a:result}};
									Promise.all(Object.values(io.users).map(function(users){
										Promise.all(users.map(function(client){
											if(client.scene == "home"){
												client.red(result);
											}
										}));
									}));
									io.sendAllClient(result);
								}
							})
						playGame();
					});
				}else{
					playGame();
				}
			});
		}else{
			var data = {};
			var dataXu = [
				"xuHuou",
				"xuBau",
				"xuGa",
				"xuCa",
				"xuCua",
				"xuTom",
			]
			var dataRed = [
				"redHuou",
				"redBau",
				"redGa",
				"redCa",
				"redCua",
				"redTom",
			]
			var active1 = Promise.all(dataXu.map(function(tab, i){
				return (data[tab] = temp.xu[i]);
			}))
			var active2 = Promise.all(dataRed.map(function(tab, i){
				return (data[tab] = temp.red[i]);
			}))
			Promise.all([active1, active2])
			.then(Results => {
				var phien = io.BauCua_phien;
				BauCua_cuoc.find({phien: phien}, {}, function(err, list) {

					var temp_data  = {mini:{baucua:{data:data}}};
					Promise.all(Object.values(io.users).map(function(users){
						Promise.all(users.map(function(client){
							if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua)
								client.red(temp_data);
						}));
					}));

					Promise.all(list.map(function(cuoc){
						cuoc = cuoc._doc;

						delete cuoc._id;
						delete cuoc.__v;
						delete cuoc.uid;
						delete cuoc.phien;
						delete cuoc.thanhtoan;
						delete cuoc.bigWin;
						delete cuoc.betwin;
						delete cuoc.time;

						return cuoc;
					}))
					.then(resultH => {
						var admin_data = {baucua:{red: temp.red, xu: temp.xu, ingame: resultH}};
						Promise.all(Object.values(io.admins).map(function(admin){
							Promise.all(admin.map(function(client){
								if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua)
									client.red(admin_data);
							}));
						}));
					})
				})
			})
		}
	});
}
function playGame(){
	io.BauCua_time = 71;
	//io.BauCua_time = 15;

	gameLoop = setInterval(async function(){
		io.BauCua_time--;
		if (io.BauCua_time <= 60) {
			if (io.BauCua_time < 0) {
				clearInterval(gameLoop);
				io.BauCua_time = 0;

				var file  = require(dataBauCua);

				var dice1 = file[0] == 6 ? (Math.random()*6)>>0 : file[0];
				var dice2 = file[1] == 6 ? (Math.random()*6)>>0 : file[1];
				var dice3 = file[2] == 6 ? (Math.random()*6)>>0 : file[2];

				file[0]     = 6;
				file[1]     = 6;
				file[2]     = 6;
				file.uid    = "";
				file.rights = 2;

				fs.writeFile(dataBauCua, JSON.stringify(file), function(err){});

				try {
					const create = await BauCua_phien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()})
					if (!!create) {
						io.BauCua_phien = create.id+1;

						var chothanhtoan = await thongtin_thanhtoan([dice1, dice2, dice3]);

						Promise.all(Object.values(io.users).map(function(users){
							Promise.all(users.map(function(client){
								client.red({mini: {baucua: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}}});
							}));
						}));

						Promise.all(Object.values(io.admins).map(function(admin){
							Promise.all(admin.map(function(client){
								client.red({baucua: {finish: true, dices:[create.dice1, create.dice2, create.dice3]}});
							}));
						}));
					}
				} catch (err) {
				}
			}else
				thongtin_thanhtoan()
		}

	}, 1000)
	return gameLoop
}

module.exports = init;
