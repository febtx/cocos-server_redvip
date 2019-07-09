
const BigBabol_hu   = require('../../../Models/BigBabol/BigBabol_hu');
const BigBabol_red  = require('../../../Models/BigBabol/BigBabol_red');
const BigBabol_xu   = require('../../../Models/BigBabol/BigBabol_xu');
const BigBabol_users = require('../../../Models/BigBabol/BigBabol_users');

const UserInfo  = require('../../../Models/UserInfo');
const Helpers   = require('../../../Helpers/Helpers');
/**
function random_cel(){
	// 7+6+5+4+3+2+1 = 28
	var a = (Math.random()*28)>>0;
	if (a === 27) {
		return 6;
	}else if (a >= 25 && a < 27) {
		return 5;
	}else if (a >= 22 && a < 25) {
		return 4;
	}else if (a >= 18 && a < 22) {
		return 3;
	}else if (a >= 13 && a < 18) {
		return 2;
	}else if (a >= 7 && a < 13) {
		return 1;
	}else{
		return 0;
	}
}
*/

function random_cel(){
	// 21+13+8+5+3+2+1 = 53
	var a = (Math.random()*53)>>0;
	if (a === 52) {
		// 52
		return 6;
	}else if (a >= 50 && a < 52) {
		// 50 51
		return 5;
	}else if (a >= 47 && a < 50) {
		// 47 48 49
		return 4;
	}else if (a >= 42 && a < 47) {
		// 42 43 44 45 46
		return 3;
	}else if (a >= 34 && a < 42) {
		// 34 35 36 37 38 39 40 41
		return 2;
	}else if (a >= 21 && a < 34) {
		// 21 22 23 24 25 26 27 28 29 30 31 32 33
		return 1;
	}else{
		// 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
		return 0;
	}
}

function check_win(data, line){
	var win_icon = 0;
	var win_type = null;
	var arrT   = [];           // Mảng lọc các bộ
	for (var i = 0; i < 3; i++) {
		var dataT = data[i];
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}
	return Promise.all(arrT.map(function(c, index){
		if (c === 3 && index > 0) {
			win_icon = index;
			win_type = 3;
		}
		if (c === 2 && (index == 1 || index == 2)) {
			win_icon = index;
			win_type = 2;
		}
	})).then(result => {
		return {line: line, win: win_icon, type: win_type};
	})
}

module.exports = function(client, data){
	var bet  = data.cuoc>>0;                   // Mức cược
	var red  = !!data.red;                     // Loại tiền (Red: true, Xu: false)
	var line = Array.from(new Set(data.line)); // Dòng cược // fix trùng lặp
	if (!(bet == 100 || bet == 1000 || bet == 10000) || line.length < 1) {
		client.send(JSON.stringify({mini:{big_babol:{status:0}}, notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "THẤT BẠI"}}));
	}else{
		var cuoc = bet*line.length;  // Tiền cược
		UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
			if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
				client.send(JSON.stringify({mini:{big_babol:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}}));
			}else{
				var phe = red ? 2 : 4;    // Phế
				var addQuy = (cuoc*0.03)>>0;
				BigBabol_hu.findOneAndUpdate({type:bet, red:red}, {$inc:{bet:addQuy}}, function(err,cat){});
				var win_arr = null;
				var bet_win = 0;
				var type = 0;   // Loại được ăn lớn nhất trong phiên
				// tạo kết quả
				BigBabol_hu.findOne({type:bet, red:red}, {}, function(err, dataHu){
					var cel1 = [random_cel(), random_cel(), random_cel()]; // Cột 1
					var cel2 = [random_cel(), random_cel(), random_cel()]; // Cột 2
					var cel3 = [random_cel(), random_cel(), random_cel()]; // Cột 3
					var nohu      = false;
					var quyHu     = dataHu.bet;
					var checkName = new RegExp("^" + client.profile.name + "$", 'i');
					checkName     = checkName.test(dataHu.name);
					if (checkName) {
						BigBabol_hu.findOneAndUpdate({type:bet, red:red}, {$set:{name:"", bet:dataHu.min}}, function(err,cat){});
						cel1[(Math.random()*3)>>0] = 6;
						cel2[(Math.random()*3)>>0] = 6;
						cel3[(Math.random()*3)>>0] = 6;
					}
					// kiểm tra kết quả
					Promise.all(line.map(function(selectLine){
						switch(selectLine){
							case 1:
								return check_win([cel1[0], cel2[0], cel3[0]], selectLine);
								break;

							case 2:
								return check_win([cel1[1], cel2[1], cel3[1]], selectLine);
								break;

							case 3:
								return check_win([cel1[2], cel2[2], cel3[2]], selectLine);
								break;

							case 4:
								return check_win([cel1[0], cel2[2], cel3[0]], selectLine);
								break;

							case 5:
								return check_win([cel1[2], cel2[0], cel3[2]], selectLine);
								break;

							case 6:
								return check_win([cel1[0], cel2[1], cel3[0]], selectLine);
								break;

							case 7:
								return check_win([cel1[0], cel2[1], cel3[2]], selectLine);
								break;

							case 8:
								return check_win([cel1[2], cel2[1], cel3[0]], selectLine);
								break;

							case 9:
								return check_win([cel1[1], cel2[2], cel3[1]], selectLine);
								break;

							case 10:
								return check_win([cel1[1], cel2[0], cel3[1]], selectLine);
								break;

							case 11:
								return check_win([cel1[2], cel2[1], cel3[2]], selectLine);
								break;

							case 12:
								return check_win([cel1[0], cel2[0], cel3[1]], selectLine);
								break;

							case 13:
								return check_win([cel1[1], cel2[1], cel3[2]], selectLine);
								break;

							case 14:
								return check_win([cel1[1], cel2[1], cel3[0]], selectLine);
								break;

							case 15:
								return check_win([cel1[2], cel2[2], cel3[1]], selectLine);
								break;

							case 16:
								return check_win([cel1[1], cel2[0], cel3[0]], selectLine);
								break;

							case 17:
								return check_win([cel1[2], cel2[1], cel3[1]], selectLine);
								break;

							case 18:
								return check_win([cel1[0], cel2[1], cel3[1]], selectLine);
								break;

							case 19:
								return check_win([cel1[1], cel2[2], cel3[2]], selectLine);
								break;

							case 20:
								return check_win([cel1[0], cel2[2], cel3[1]], selectLine);
								break;
						}
					}))
					.then(result => {
						Promise.all(result.filter(function(line_win){
							if (!!line_win.win) {
								if (line_win.win == 6 && !nohu) {
									// Nổ hũ
									nohu = true;
									bet_win += quyHu;
									type = 6;
								}else if(line_win.win == 5) {
									// x85
									bet_win += bet*85;
									type = type < 5 ? 5 : type;
								}else if(line_win.win == 4) {
									// x40
									bet_win += bet*40;
									type = type < 4 ? 4 : type;
								}else if(line_win.win == 3) {
									// x20
									bet_win += bet*20;
									type = type < 3 ? 3 : type;
								}else if(line_win.win == 2 && line_win.type == 3) {
									// x8
									bet_win += bet*8;
								}else if(line_win.win == 2 && line_win.type == 2) {
									//	x0.8
									bet_win += (bet*0.8)>>0;
								}else if(line_win.win == 1 && line_win.type == 3) {
									// x4
									bet_win += bet*4;
								}else if(line_win.win == 1 && line_win.type == 2) {
									// x0.4
									bet_win += (bet*0.4)>>0;
								}
							}
							return !!line_win.win;
						}))
						.then(result2 => {
							bet_win = bet_win-Math.ceil(bet_win*phe/100); // Cắt phế 2% - 4% ăn được
							var tien = bet_win - cuoc;
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
								  	client.send(JSON.stringify({mini:{big_babol:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}}));
								  }else{
								  	client.send(JSON.stringify({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win: result2, nohu: nohu, win: bet_win, phien: small.id}}, user:{red:user.red-bet}}));
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
								  	client.send(JSON.stringify({mini:{big_babol:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}}));
								  }else{
								  	client.send(JSON.stringify({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win: result2, nohu: nohu, win: bet_win, phien: small.id, thuong:thuong}}, user:{xu:user.xu-bet}}));
								  }
								});
							}
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err,cat){});
							BigBabol_users.findOneAndUpdate({id:client.UID}, {$inc:mini_users}, function(err,cat){});
						})
					})
				})
			}
		});
	}
};
