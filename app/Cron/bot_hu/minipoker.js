
var HU             = require('../../Models/HU');

var miniPokerUsers = require('../../Models/miniPoker/miniPoker_users');

var miniPokerRed   = require('../../Models/miniPoker/miniPokerRed');

var UserInfo       = require('../../Models/UserInfo');

var Helpers        = require('../../Helpers/Helpers');

var base_card      = require('../../../data/card');

function spin(io, user){
	var bet = 100;
	var red = true;

	var a = (Math.random()*16)>>0;

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

	var phe     = 2;    // Phế
	var addQuy  = (bet*0.01)>>0;
	var an      = 0;
	var code    = 0;
	var text    = '';
	var thuong  = 0;
	var card    = [...base_card.card];

	// tráo bài
	card = Helpers.shuffle(card); // tráo bài lần 1
	card = Helpers.shuffle(card); // tráo bài lần 2
	card = Helpers.shuffle(card); // tráo bài lần 3

	//var ketqua  = [];            // bốc nhẫu nhiên
	var ketqua      = card.slice(0, 5); // bốc 5 thẻ đầu tiên

	var ketqua_temp = [...ketqua]; // copy kết quả để sử lý, (tránh sắp sếp, mất tính ngẫu nhiên)

	var arrT   = [];           // Mảng chứa các bộ (Đôi, Ba, Bốn) trong bài
	for (var i = 0; i < 5; i++) {
		var dataT = ketqua[i];
		if (void 0 === arrT[dataT.card]) {
			arrT[dataT.card] = 1;
		}else{
			arrT[dataT.card] += 1;
		}
	}

	var tuQuy   = null;  // Tên bộ tứ
	var bo2     = 0;     // bộ 2 (có bao nhiêu 2)
	var bo2_a   = [];    // Danh sách tên bộ 2
	var bo3     = false; // bộ ba (có bao nhiêu bộ 3)
	var bo3_a   = null;  // Tên bộ 3

	Promise.all(arrT.map(function(c, index){
		if (c === 4) {
			tuQuy = index;
		}
		if (c === 3) {
			bo3   = true;
			bo3_a = index;
		}
		if (c === 2) {
			bo2++;
			bo2_a[bo2_a.length] = index;
		}
	}))

	var type     = ketqua[0].type; // chất đầu tiên
	var dongChat = ketqua_temp.filter(type_card => type_card.type == type); // Kiểm tra đồng chất
	dongChat     = dongChat.length == 5 ? true : false;  // Dây là đồng chất

	var AK    = ketqua_temp.sort(function(a, b){return a.card - b.card}); // sắp sếp từ A đến K (A23...JQK)
	var isDay = false; // là 1 dây
	if (bo3 == false && bo2 == 0 && tuQuy == null) {
		if (AK[4].card - AK[0].card === 4 && AK[0].card !== 0) {
			isDay = true;
		}else if (AK[4].card - AK[1].card === 3 && AK[0].card === 0 && AK[4].card === 12) {
			isDay = true;
		}
	}

	HU.findOne({game: "minipoker", type:bet, red:red}, 'name bet min toX balans x', function(err, dataHu){
		var uInfo      = {};
		var mini_users = {};
		var huUpdate   = {bet:addQuy, toX:0, balans:0};

		var quyHu     = dataHu.bet;
		var quyMin    = dataHu.min;

		var toX       = dataHu.toX;
		var balans    = dataHu.balans;

		var checkName = new RegExp("^" + user.name + "$", 'i');
		checkName     = checkName.test(dataHu.name);

		if (checkName || (dongChat && isDay && AK[4].card > 9)) {
			// NỔ HŨ (DÂY ĐỒNG CHẤT CỦA DÂY ĐẾN J TRỞ LÊN) Hoặc được xác định là nổ hũ
			if (toX > 0) {
				toX -= 1;
				huUpdate.toX -= 1;
			}else if (balans > 0) {
				balans -= 1;
				huUpdate.balans -= 1;
			}
			if (toX < 1 && balans > 0) {
				quyMin = quyMin*dataHu.x;
			}
			HU.updateOne({game: "minipoker", type:bet, red:red}, {$set:{name:"", bet:quyMin}}).exec();
			if (checkName){
				// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
				var randomType = (Math.random()*4)>>0;           // Ngẫu nhiên chất bài
				var randomMin  = ((Math.random()*(9-6+1))+6)>>0; // Ngẫu nhiên dây bài bắt đầu từ (7 - 10)
				Promise.all(base_card.card.filter(function(cardT){
					if (randomMin == 9 && cardT.card == 0 && cardT.type == randomType) {
						return true;
					}else if (cardT.card >= randomMin && cardT.card < randomMin+5 && cardT.type == randomType) {
						return true;
					}
					return false;
				}))
				.then(resultCard => {
					ketqua = Helpers.shuffle(resultCard); // tráo bài
				})
			}

			an   = (quyHu-Math.ceil(quyHu*phe/100))>>0;

			if (red){
				Helpers.ThongBaoNoHu(io, {title: "MINI POKER", name: user.name, bet: Helpers.numberWithCommas(an)});
				huUpdate['hu']   = uInfo['hu']   = mini_users['hu']   = 1; // Cập nhật Số Hũ Red đã Trúng
			}else{
				huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 1; // Cập nhật Số Hũ Xu đã Trúng
			}

			text = 'Nổ Hũ';
			code = 9;
		}else if (isDay && dongChat) {
			// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT)
			an   = (bet*1000);
			text = 'Thắng Lớn';
			code = 8;
			red && Helpers.ThongBaoBigWin(io, {game: "MINI POKER", users: user.name, bet: Helpers.numberWithCommas(an), status: 2});
		}else if (tuQuy != null) {
			// x150     TỨ QUÝ (TỨ QUÝ)
			an   = (bet*150);
			text = 'Tứ Quý';
			code = 7;
			red && Helpers.ThongBaoBigWin(io, {game: "MINI POKER", users: user.name, bet: Helpers.numberWithCommas(an), status: 2});
		}else if (bo3 && bo2 > 0) {
			// x50      CÙ LŨ (1 BỘ 3 VÀ 1 BỘ 2)
			an   = (bet*50);
			text = 'Cù Lũ';
			code = 6;
		}else if (dongChat) {
			// x20		THÙNG (ĐỒNG CHẤT)
			an   = (bet*20);
			text = 'Thùng';
			code = 5;
		}else if (isDay && !dongChat) {
			// x13		SẢNH (DÂY)
			an   = (bet*13);
			text = 'Sảnh';
			code = 4;
		}else if (bo3 && bo2 == 0) {
			// x8 		SÁM CÔ (1 BỘ 3)
			an   = (bet*8);
			text = 'Sám Cô';
			code = 3;
		}else if (bo2 > 1) {
			// x5	 	THÚ (2 ĐÔI)
			an   = (bet*5);
			text = 'Thú';
			code = 2;
		}else if (bo2 == 1 && (bo2_a[0] > 9 || bo2_a[0] == 0)) {
			// x2.5	 	1 ĐÔI > J
			an   = (bet*2.5);
			text = 'Đôi ' + base_card.name[bo2_a[0]];
			code = 1;
		}

		var tien = an-bet;
		setTimeout(function(){
			uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
			huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = bet;       // Cập nhật Số Red đã chơi
			if (tien > 0){
				huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
			}
			if (tien < 0){
				huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
			}
			if (code == 9){
				uInfo['hu'] = mini_users['hu'] = 1;         // Cập nhật Số Hũ Red đã Trúng
			}
			miniPokerRed.create({'name': user.name, 'win': an, 'bet': bet, 'type': code, 'kq': ketqua, 'time': new Date()}, function (err, small) {});
			HU.updateOne({game: "minipoker", type:bet, red:red}, {$inc:huUpdate}).exec();
			UserInfo.updateOne({id:user.id}, {$inc: uInfo}).exec();
			miniPokerUsers.updateOne({'uid': user.id}, {$set:{time: new Date()}, $inc: mini_users}).exec();
		}, 10);
	});
}

module.exports = function(io, listBot){
	var list = [...listBot];
	if (list.length) {
		var max = (list.length*30/100)>>0;
		list = Helpers.shuffle(list);
		list = Helpers.shuffle(list);
		list = list.slice(0, max);
		Promise.all(list.map(function(user){
			spin(io, user);
		}))
	}
};
