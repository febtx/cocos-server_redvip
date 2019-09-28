
let HU         = require('../../Models/HU');

let Candy_red  = require('../../Models/Candy/Candy_red');
let Candy_user = require('../../Models/Candy/Candy_user');

let UserInfo   = require('../../Models/UserInfo');

let Helpers    = require('../../Helpers/Helpers');

let random_cel2 = function(){
	let a = Math.floor(Math.random()*28);
	if (a == 27) {
		// 27
		return 6;
	}else if (a >= 25 && a < 27) {
		// 25 26
		return 5;
	}else if (a >= 22 && a < 25) {
		// 22 23 24
		return 4;
	}else if (a >= 18 && a < 22) {
		// 18 19 20 21
		return 3;
	}else if (a >= 13 && a < 18) {
		// 13 14 15 16 17
		return 2;
	}else if (a >= 7 && a < 13) {
		// 7 8 9 10 11 12
		return 1;
	}else{
		// 0 1 2 3 4 5 6   
		return 0;
	}
}

let check_win = function(data, line){
	let win_icon = 0;
	let number_win = null;
	let arrT   = [];           // Mảng lọc các bộ
	for (let i = 0; i < 5; i++) {
		let dataT = data[i];
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}
	return Promise.all(arrT.map(function(c, index){
		if (c === 5) {
			win_icon = index;
			number_win = 5;
		}
		if (c === 4) {
			win_icon = index;
			number_win = 4;
		}
		if (c === 3) {
			win_icon = index;
			number_win = 3;
		}
		return void 0;
	})).then(result => {
		return {line: line, win: win_icon, type: number_win};
	})
}

let spin = function(io, user){
	let bet = 100;
	let red = true;

	let line = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

	let a = Math.floor(Math.random()*16);

	if (a == 15) {
		//  14
		bet = 10000;
	}else if (a >= 11 && a < 15) {
		//  10 11 12 13
		bet = 1000;
	}else{
		// 0 1 2 3 4 5 6 7 8 9
		bet = 100;
	}

	let tongCuoc = bet*line.length;  // Tiền cược
	let phe = 2;    // Phế
	let addQuy = Math.floor(tongCuoc*0.005);

	let bet_win   = 0;
	let free      = 0;
	let bonusX    = 0;
	let type      = 0;   // Loại được ăn lớn nhất trong phiên
	let isFree    = false;
	let nohu      = false;
	let isBigWin  = false;
	// tạo kết quả
	HU.findOne({game:'candy', type:bet, red:red}, {}, function(err2, dataHu){
		let uInfo      = {};
		let mini_users = {};
		let huUpdate   = {bet:addQuy};
		if (red){
			huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     = 0; // Khởi tạo
		}else{
			huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 0; // Khởi tạo
		}


		let aRwin = Math.floor(Math.random()*16);
		let celSS = [];

		if (aRwin == 15) {
			// no hu
			celSS = [
				random_cel2(), random_cel2(), random_cel2(),
				random_cel2(), random_cel2(), random_cel2(),
				6,             6,             6,
				2,             1,             1,
				0,             0,             0,
			];
		}else{
			// kho
			celSS = [
				random_cel2(), random_cel2(), random_cel2(),
				random_cel2(), random_cel2(), 6,
				4,             3,             5,
				2,             1,             1,
				0,             0,             0,
			];
		}

		celSS = Helpers.shuffle(celSS);

		let cel1 = [celSS[0],  celSS[1],  celSS[2]];  // Cột 1
		let cel2 = [celSS[3],  celSS[4],  celSS[5]];  // Cột 2
		let cel3 = [celSS[6],  celSS[7],  celSS[8]];  // Cột 3
		let cel4 = [celSS[9],  celSS[10], celSS[11]]; // Cột 4
		let cel5 = [celSS[12], celSS[13], celSS[14]]; // Cột 5

		let quyHu     = dataHu.bet;

		// kiểm tra kết quả
		Promise.all(line.map(function(selectLine){
			switch(selectLine){
				case 1:
					return check_win([cel1[1], cel2[1], cel3[1], cel4[1], cel5[1]], selectLine);
					break;

				case 2:
					return check_win([cel1[0], cel2[0], cel3[0], cel4[0], cel5[0]], selectLine);
					break;

				case 3:
					return check_win([cel1[2], cel2[2], cel3[2], cel4[2], cel5[2]], selectLine);
					break;

				case 4:
					return check_win([cel1[1], cel2[1], cel3[0], cel4[1], cel5[1]], selectLine);
					break;

				case 5:
					return check_win([cel1[1], cel2[1], cel3[2], cel4[1], cel5[1]], selectLine);
					break;

				case 6:
					return check_win([cel1[0], cel2[0], cel3[1], cel4[0], cel5[0]], selectLine);
					break;

				case 7:
					return check_win([cel1[2], cel2[2], cel3[1], cel4[2], cel5[2]], selectLine);
					break;

				case 8:
					return check_win([cel1[0], cel2[2], cel3[0], cel4[2], cel5[0]], selectLine);
					break;

				case 9:
					return check_win([cel1[2], cel2[0], cel3[2], cel4[0], cel5[2]], selectLine);
					break;

				case 10:
					return check_win([cel1[1], cel2[0], cel3[2], cel4[0], cel5[1]], selectLine);
					break;

				case 11:
					return check_win([cel1[2], cel2[1], cel3[0], cel4[1], cel5[2]], selectLine);
					break;

				case 12:
					return check_win([cel1[0], cel2[1], cel3[2], cel4[1], cel5[0]], selectLine);
					break;

				case 13:
					return check_win([cel1[1], cel2[2], cel3[1], cel4[0], cel5[1]], selectLine);
					break;

				case 14:
					return check_win([cel1[1], cel2[0], cel3[1], cel4[2], cel5[1]], selectLine);
					break;

				case 15:
					return check_win([cel1[2], cel2[1], cel3[1], cel4[1], cel5[2]], selectLine);
					break;

				case 16:
					return check_win([cel1[0], cel2[1], cel3[1], cel4[1], cel5[0]], selectLine);
					break;

				case 17:
					return check_win([cel1[1], cel2[2], cel3[2], cel4[2], cel5[1]], selectLine);
					break;

				case 18:
					return check_win([cel1[1], cel2[0], cel3[0], cel4[0], cel5[1]], selectLine);
					break;

				case 19:
					return check_win([cel1[2], cel2[2], cel3[1], cel4[0], cel5[0]], selectLine);
					break;

				case 20:
					return check_win([cel1[0], cel2[0], cel3[1], cel4[2], cel5[2]], selectLine);
					break;
			}
		}))
		.then(result => {
			Promise.all(result.filter(function(line_win){
				let checkWin = false;
				if (line_win.win == 6) {
					if (line_win.type === 5) {
						checkWin = true;
						// Nổ Hũ
						type = 2;
						if (!nohu) {
							let okHu = Math.floor(quyHu-Math.ceil(quyHu*phe/100));
							bet_win += okHu;
							HU.updateOne({game:'candy', type:bet, red:red}, {$set:{name:'', bet:dataHu.min}}).exec();
							red && Helpers.ThongBaoNoHu(io, {title:'Candy', name: user.name, bet: Helpers.numberWithCommas(okHu)});
						}else{
							let okHu = Math.floor(dataHu.min-Math.ceil(dataHu.min*phe/100));
							bet_win += okHu;
							red && Helpers.ThongBaoNoHu(io, {title:'Candy', name: user.name, bet: Helpers.numberWithCommas(okHu)});
						}
						if (red){
							huUpdate.hu += 1;
							uInfo.hu += 1;
							mini_users.hu += 1;
						}else{
							huUpdate.huXu += 1;
							uInfo.huXu += 1;
							mini_users.huXu += 1;
						}
						nohu = true;
					}else if (!nohu && line_win.type === 4){
						// Bonus x5
						checkWin = true;
						bonusX += 5;
					}else if (!nohu && line_win.type === 3){
						// Bonus x1
						checkWin = true;
						bonusX += 1;
					}
				}else if(!nohu && line_win.win == 5) {
					if (line_win.type === 5) {
						checkWin = true;
						// x5000
						bet_win += bet*5000;
					}else if (line_win.type === 4){
						// x25
						checkWin = true;
						bet_win += bet*30;
					}
				}else if(line_win.win == 4) {
					if (line_win.type === 5) {
						checkWin = true;
						// free x15
						free += 15;
						isFree = true;
					}else if (line_win.type === 4){
						// free x5
						checkWin = true;
						free += 5;
						isFree = true;
					}else if (line_win.type === 3){
						// free x1
						checkWin = true;
						free += 1;
						isFree = true;
					}
				}else if(!nohu && line_win.win == 3) {
					if (line_win.type === 5) {
						checkWin = true;
						// x1000
						bet_win += bet*1000;
					}else if (line_win.type === 4){
						// x20
						checkWin = true;
						bet_win += bet*20;
					}
				}else if(!nohu && line_win.win == 2) {
					if (line_win.type === 5) {
						checkWin = true;
						// x200
						bet_win += bet*200;
					}else if (line_win.type === 4){
						// x15
						checkWin = true;
						bet_win += bet*15;
					}else if (line_win.type === 3){
						// x3
						checkWin = true;
						bet_win += bet*3;
					}
				}else if(!nohu && line_win.win == 1) {
					if (line_win.type === 5) {
						checkWin = true;
						// x80
						bet_win += bet*80;
					}else if (line_win.type === 4){
						// x10
						checkWin = true;
						bet_win += bet*10;
					}
				}else if(!nohu && line_win.win == 0) {
					if (line_win.type === 5) {
						checkWin = true;
						// x20
						bet_win += bet*20;
					}else if (line_win.type === 4){
						// x6
						checkWin = true;
						bet_win += bet*6;
					}else if (line_win.type === 3){
						// x2
						checkWin = true;
						bet_win += bet*2;
					}
				}
				return checkWin;
			}))
			.then(result2 => {
				let tien = bet_win-tongCuoc;
				if (!nohu && bet_win >= tongCuoc*2.24) {
					isBigWin = true;
					type = 1;
					red && Helpers.ThongBaoBigWin(io, {game:'Candy', users: user.name, bet: Helpers.numberWithCommas(bet_win), status: 2});
				}
				uInfo.red = tien;
				huUpdate.redPlay = tongCuoc;
				uInfo.redPlay = tongCuoc;
				mini_users.bet = tongCuoc;

				if (tien > 0){
					huUpdate.redWin = tien;
					uInfo.redWin = tien;
					mini_users.win = tien;         // Cập nhật Số Red đã Thắng
				}
				if (tien < 0){
					let tienLost = tien*-1;
					huUpdate.redLost = tienLost;
					uInfo.redLost = tienLost;
					mini_users.lost = tienLost; // Cập nhật Số Red đã Thua
				}

				Candy_red.create({'name': user.name, 'type': type, 'win': bet_win, 'bet': bet, 'kq': result2.length, 'line': line.length, 'time': new Date()}, function(err) {});
				HU.updateOne({game:'candy', type:bet, red:red}, {$inc:huUpdate}).exec();
				UserInfo.updateOne({id:user.id},{$inc:uInfo}).exec();
				Candy_user.updateOne({'uid':user.id}, {$set:{time: new Date()}, $inc:mini_users}).exec();
			})
		})
	})
}

module.exports = function(io, listBot){
	if (listBot.length) {
		let max = Math.floor(listBot.length*5/100);
		listBot = Helpers.shuffle(listBot);
		listBot = listBot.slice(0, max);
		Promise.all(listBot.map(function(user){
			spin(io, user);
		}))
	}
};
