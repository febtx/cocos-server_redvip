
var BigBabol_hu    = require('../../../Models/BigBabol/BigBabol_hu');
var BigBabol_red   = require('../../../Models/BigBabol/BigBabol_red');
var BigBabol_xu    = require('../../../Models/BigBabol/BigBabol_xu');
var BigBabol_users = require('../../../Models/BigBabol/BigBabol_users');

var UserInfo     = require('../../../Models/UserInfo');
var ThongBaoNoHu = require('../../../Helpers/Helpers').ThongBaoNoHu;
var shuffle      = require('../../../Helpers/Helpers').shuffle;

function random_cel3(){
	return (Math.random()*6)>>0;
}

function random_cel2(){
	var a = (Math.random()*21)>>0;
	if (a == 20) {
		// 20
		return 5;
	}else if (a >= 18 && a < 20) {
		// 18 19
		return 4;
	}else if (a >= 15 && a < 18) {
		// 15 16 17
		return 3;
	}else if (a >= 11 && a < 15) {
		// 11 12 13 14
		return 2;
	}else if (a >= 6 && a < 11) {
		// 6 7 8 9 10
		return 1;
	}else{
		// 0 1 2 3 4 5
		return 0;
	}
}

function check_win(data, line){
	var win_icon = 0;
	var heso     = 0;
	var win_type = null;

	var thaythe  = 0;  // Thay Thế (WinD)

	var arrT     = []; // Mảng lọc các bộ

	for (var i = 0; i < 3; i++) {
		var dataT = data[i];
		if (dataT == 5) {
			++thaythe;
		}
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	return new Promise((aT, bT) => {
		Promise.all(arrT.map(function(c, index){
			if (index != 5) {
				arrT[index] += thaythe;
			}
			return index != 5 ? c+thaythe : c;
		})).then(resultA1 => {
			Promise.all(arrT.map(function(c, index){
				if (c === 3) {
					win_icon = index;
					win_type = 3;
				}
				if (c === 2 && (index == 0 || index == 1)) {
					win_icon = index;
					win_type = 2;
					if (index == 0) {
						heso += 0.4;
					}else{
						heso += 0.8;
					}
				}
				return void 0;
			})).then(result => {
				aT({line: line, win: win_icon, type: win_type, heso: heso});
			})
		})
	})
	.then(result => {
		return result;
	})
}

module.exports = function(client, data){
	if (!!data && !!data.cuoc && Array.isArray(data.line)) {
		var bet  = data.cuoc>>0;                   // Mức cược
		var red  = !!data.red;                     // Loại tiền (Red: true, Xu: false)
		var line = Array.from(new Set(data.line)); // Dòng cược // fix trùng lặp
		if (!(bet == 100 || bet == 1000 || bet == 10000) || line.length < 1) {
			client.red({mini:{big_babol:{status:0}}, notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "THẤT BẠI"}});
		}else{
			var cuoc = bet*line.length;  // Tiền cược
			UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({mini:{big_babol:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
				}else{
					var phe = red ? 2 : 4;    // Phế
					var addQuy = (cuoc*0.01)>>0;
					BigBabol_hu.findOneAndUpdate({type:bet, red:red}, {$inc:{bet:addQuy}}, function(err,cat){});

					var line_nohu = 0;
					var win_arr   = null;
					var bet_win   = 0;
					var type      = 0;   // Loại được ăn lớn nhất trong phiên
					// tạo kết quả
					BigBabol_hu.findOne({type:bet, red:red}, {}, function(err, dataHu){

						var celSS = [
							random_cel3(), random_cel2(), random_cel2(),
							random_cel2(), 2,             1,
							1,             0,             0,
						]; // Super

						celSS = shuffle(celSS); // tráo bài lần 1
						celSS = shuffle(celSS); // tráo bài lần 2

						var cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
						var cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
						var cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3

						var nohu      = false;
						var isBigWin  = false;
						var quyHu     = dataHu.bet;
						var quyMin    = dataHu.min;
						var checkName = new RegExp("^" + client.profile.name + "$", 'i');
						checkName     = checkName.test(dataHu.name);
						if (checkName) {
							BigBabol_hu.findOneAndUpdate({type:bet, red:red}, {$set:{name:"", bet:dataHu.min}}, function(err,cat){});

							line_nohu = ((Math.random()*line.length)>>0);
							line_nohu = line[line_nohu];
						}
						// kiểm tra kết quả
						Promise.all(line.map(function(selectLine){
							switch(selectLine){
								case 1:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[0]], selectLine);
									break;

								case 2:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[1]], selectLine);
									break;

								case 3:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[2]], selectLine);
									break;

								case 4:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[0]], selectLine);
									break;

								case 5:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[0] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[0], cel3[2]], selectLine);
									break;

								case 6:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[0]], selectLine);
									break;

								case 7:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[2]], selectLine);
									break;

								case 8:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[0]], selectLine);
									break;

								case 9:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[1]], selectLine);
									break;

								case 10:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[1]], selectLine);
									break;

								case 11:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[2]], selectLine);
									break;

								case 12:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[1]], selectLine);
									break;

								case 13:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[2]], selectLine);
									break;

								case 14:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[0]], selectLine);
									break;

								case 15:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[1]], selectLine);
									break;

								case 16:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[0]], selectLine);
									break;

								case 17:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[1]], selectLine);
									break;

								case 18:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[1]], selectLine);
									break;

								case 19:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[2]], selectLine);
									break;

								case 20:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[1]], selectLine);
									break;
							}
						}))
						.then(result => {
							Promise.all(result.filter(function(line_win){
								if (line_win.type != null) {
									if(line_win.win == 5) {
										// Nổ hũ
										if (!nohu) {
											bet_win += quyHu;
											red && ThongBaoNoHu(client, {title: "BigBabol", name: client.profile.name, bet: quyHu-Math.ceil(quyHu*phe/100)});
										}else{
											bet_win += quyMin;
											red && ThongBaoNoHu(client, {title: "BigBabol", name: client.profile.name, bet: quyMin-Math.ceil(quyMin*phe/100)});
										}
										nohu = true;
										type = 2;
									}else if(!nohu && line_win.win == 4) {
										// x80
										bet_win += bet*80;
									}else if(!nohu && line_win.win == 3) {
										// x40
										bet_win += bet*40;
									}else if(!nohu && line_win.win == 2) {
										// x20
										bet_win += bet*20;
									}else if(!nohu && line_win.win == 1 && line_win.type == 3) {
										// x8
										bet_win += bet*8;
									}else if(!nohu && line_win.win == 1 && line_win.type == 2) {
										//	x0.8
										bet_win += (bet*line_win.heso)>>0;
									}else if(!nohu && line_win.win == 0 && line_win.type == 3) {
										// x4
										bet_win += bet*4;
									}else if(!nohu && line_win.win == 0 && line_win.type == 2) {
										// x0.4
										bet_win += (bet*line_win.heso)>>0;
									}
								}
								return (line_win.type != null);
							}))
							.then(result2 => {
								bet_win  = (bet_win-Math.ceil(bet_win*phe/100))>>0; // Cắt phế 2% - 4% ăn được
								var tien = bet_win-cuoc;
								if (!nohu && bet_win >= cuoc**2.24) {
									isBigWin = true;
									type = 1;
								}
								var uInfo      = {};
								var mini_users = {};
								var thuong     = 0;
								if (red) {
									uInfo['red'] = tien;                                   // Cập nhật Số dư Red trong tài khoản
									uInfo['redPlay'] = mini_users['bet'] = cuoc;           // Cập nhật Số Red đã chơi
									if (tien > 0){
										uInfo['redWin'] = mini_users['win'] = tien;        // Cập nhật Số Red đã Thắng
									}
									if (tien < 0){
										uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
									}
									if (!!nohu){
										uInfo['hu'] = mini_users['hu'] = 1;                // Cập nhật Số Hũ Red đã Trúng
									}
									BigBabol_red.create({'name': client.profile.name, 'type': type, 'win': bet_win, 'bet': bet, 'kq': result2.length, 'line': line.length, 'time': new Date()}, function (err, small) {
									  if (err){
									  	client.red({mini:{big_babol:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									  }else{
									  	client.red({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win: result2, nohu: nohu, isBigWin: isBigWin, win: bet_win, phien: small.id}}, user:{red:user.red-cuoc}});
									  }
									});
								}else{
									thuong = (bet_win*0.039589)>>0;
									uInfo['xu'] = tien;                               // Cập nhật Số dư XU trong tài khoản
									uInfo['xuPlay'] = mini_users['betXu'] = cuoc;     // Cập nhật Số XU đã chơi
									if (thuong > 0){
										uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong;  // Cập nhật Số dư Red trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
									}
									if (tien > 0){
										uInfo['xuWin'] = mini_users['winXu'] = tien;         // Cập nhật Số Red đã Thắng
									}
									if (tien < 0){
										uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số Red đã Thua
									}
									if (!!nohu){
										uInfo['huXu'] = mini_users['huXu'] = 1;             // Cập nhật Số Hũ Xu đã Trúng
									}
									BigBabol_xu.create({'name': client.profile.name, 'type': type, 'win': bet_win, 'bet': bet, 'kq': result2.length, 'line': line.length, 'time': new Date()}, function (err, small) {
									  if (err){
									  	client.red({mini:{big_babol:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									  }else{
									  	client.red({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win: result2, nohu: nohu, isBigWin: isBigWin, win: bet_win, phien: small.id, thuong:thuong}}, user:{xu:user.xu-cuoc}});
									  }
									});
								}
								UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err,cat){});
								BigBabol_users.findOneAndUpdate({'uid':client.UID}, {$inc:mini_users}, function(err,cat){});
							})
						})
					})
				}
			});
		}
	}
};
