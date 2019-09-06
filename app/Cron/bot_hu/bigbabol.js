
var HU             = require('../../Models/HU');

var BigBabol_red   = require('../../Models/BigBabol/BigBabol_red');
var BigBabol_users = require('../../Models/BigBabol/BigBabol_users');

var UserInfo       = require('../../Models/UserInfo');

var Helpers        = require('../../Helpers/Helpers');


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

function spin(io, user){
	var bet = 100;
	var red = true;

	var line = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

	var a = (Math.random()*15)>>0;

	if (a == 14) {
		//  14
		bet = 10000;
	}else if (a >= 10 && a < 14) {
		//  10 11 12 13
		bet = 1000;
	}else{
		// 0 1 2 3 4 5 6 7 8 9
		bet = 100;
	}

	var phe = 2;    // Phế
	var addQuy = (cuoc*0.01)>>0;

	var line_nohu = 0;
	var win_arr   = null;
	var bet_win   = 0;
	var type      = 0;   // Loại được ăn lớn nhất trong phiên
	// tạo kết quả
	HU.findOne({game:'bigbabol', type:bet, red:red}, 'name bet min toX balans x', function(err, dataHu){
		var uInfo      = {};
		var mini_users = {};
		var huUpdate   = {bet:addQuy, toX:0, balans:0};
		if (red){
			huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     = 0; // Khởi tạo
		}else{
			huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 0; // Khởi tạo
		}

		var celSS = [
			random_cel2(), random_cel2(), random_cel2(),
			random_cel2(), 5,             random_cel2(),
			1,             0,             0,
		];

		celSS = Helpers.shuffle(celSS); // tráo bài lần 1
		celSS = Helpers.shuffle(celSS); // tráo bài lần 2

		var cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
		var cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
		var cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3

		var nohu      = false;
		var isBigWin  = false;
		var quyHu     = dataHu.bet;
		var quyMin    = dataHu.min;

		var toX      = dataHu.toX;
		var balans   = dataHu.balans;

		var checkName = new RegExp("^" + user.name + "$", 'i');
		checkName     = checkName.test(dataHu.name);
		if (checkName) {
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
						if (toX > 0) {
							toX -= 1;
							huUpdate.toX -= 1;
						}else if (balans > 0) {
							balans -= 1;
							huUpdate.balans -= 1;
						}
						if (toX < 1 && balans > 0) {
							quyMin = dataHu.min*dataHu.x;
						}
						if (!nohu) {
							var okHu = (quyHu-Math.ceil(quyHu*phe/100))>>0;
							bet_win += okHu;
							red && Helpers.ThongBaoNoHu(io, {title: "BigBabol", name: user.name, bet: Helpers.numberWithCommas(okHu)});
						}else{
							var okHu = (quyMin-Math.ceil(quyMin*phe/100))>>0;
							bet_win += okHu;
							red && Helpers.ThongBaoNoHu(io, {title: "BigBabol", name: user.name, bet: Helpers.numberWithCommas(okHu)});
						}
						HU.updateOne({game:'bigbabol', type:bet, red:red}, {$set:{name:"", bet:quyMin}}).exec();

						if (red){
							huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     += 1;
						}else{
							huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] += 1;
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
				var tien = bet_win-cuoc;
				if (!nohu && bet_win >= cuoc*2.24) {
					isBigWin = true;
					type = 1;
					red && Helpers.ThongBaoBigWin(io, {game: "BigBabol", users: user.name, bet: Helpers.numberWithCommas(bet_win), status: 2});
				}

				uInfo['red'] = tien;                                                 // Cập nhật Số dư Red trong tài khoản
				huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = cuoc;   // Cập nhật Số Red đã chơi
				if (tien > 0){
					huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien; // Cập nhật Số Red đã Thắng
				}
				if (tien < 0){
					huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
				}
				BigBabol_red.create({'name': user.name, 'type': type, 'win': bet_win, 'bet': bet, 'kq': result2.length, 'line': line.length, 'time': new Date()}, function (err, small) {});
				HU.updateOne({game:'bigbabol', type:bet, red:red}, {$inc:huUpdate}).exec();
				UserInfo.updateOne({id:client.UID}, {$inc:uInfo}).exec();
				BigBabol_users.updateOne({'uid':client.UID}, {$set:{time: new Date()}, $inc:mini_users}).exec();
			})
		})
	})
}

module.exports = function(io, listBot){
	var list = [...listBot];
	if (list.length) {
		var max = (list.length*50/100)>>0;
		list = Helpers.shuffle(list);
		list = Helpers.shuffle(list);
		list = list.slice(0, max);
		Promise.all(list.map(function(user){
			spin(io, user);
		}))
	}
};
