
let HU            = require('../../Models/HU');

let Mini3Cay_red  = require('../../Models/Mini3Cay/Mini3Cay_red');
let Mini3Cay_user = require('../../Models/Mini3Cay/Mini3Cay_user');

let UserInfo      = require('../../Models/UserInfo');

let Helpers       = require('../../Helpers/Helpers');
let base_card     = require('../../../data/card');

let spin = function(io, user){
	let cuoc = 100;
	let red = true;

	let a = Math.floor(Math.random()*16);

	if (a == 15) {
		//  14
		cuoc = 10000;
	}else if (a >= 11 && a < 15) {
		//  10 11 12 13
		cuoc = 1000;
	}else{
		// 0 1 2 3 4 5 6 7 8 9
		cuoc = 100;
	}

	let phe = red ? 2 : 4;    // Phế
	let addQuy = Math.floor(cuoc*0.01);
	// Sử lý bài
	let an      = 0;
	let code    = 0;
	let text    = '';
	let thuong  = 0;
	let nohu    = false;
	let card    = [...base_card.card]
		.slice(0, 36);

	card = Helpers.shuffle(card); // tráo bài lần 1

	let ketqua = card.slice(3, 6); // bốc 3 thẻ đầu tiên
	let ketqua_temp = [...ketqua]; // copy kết quả để sử lý, (tránh sắp sếp, mất tính ngẫu nhiên)
	
	let ADiamond = false;       // Có Át rô trong bài?

	let arrT   = [];           // Mảng lọc các bộ 2 trong bài
	for (let i = 0; i < 3; i++) {
		let dataT = ketqua[i];
		if (void 0 === arrT[dataT.card]) {
			arrT[dataT.card] = 1;
		}else{
			arrT[dataT.card] += 1;
		}
		if (dataT.card == 0 && dataT.type == 1) {
			ADiamond = true; // có Át rô trong bài.
		}
	}

	let bo3     = false; // bộ ba (Kết quả có phải là bộ 3?)
	let bo3_a   = null;  // Tên bộ 3
	Promise.all(arrT.map(function(c, index){
		if (c === 3) {
			bo3   = true;
			bo3_a = index;
		}
	}))

	let type     = ketqua[0].type;                                     // Lấy ra chất đầu tiên trong bài
	let dongChat = ketqua_temp.filter(type_card => type_card.type == type); // Lọc đồng chất
	dongChat     = dongChat.length == 3 ? true : false;                // Dây là đồng chất

	let TongDiem = (ketqua[0].card + ketqua[1].card + ketqua[2].card + 3)%10;     // Tổng điểm
	TongDiem = TongDiem === 0 ? 10 : TongDiem;
	let LienTiep   = ketqua_temp.sort(function(a,b){return a.card - b.card});
	let Day        = LienTiep[2].card - LienTiep[0].card === 2 && LienTiep[2].card != LienTiep[1].card && LienTiep[1].card != LienTiep[0].card ? true : false; // Bộ liên tiếp

	// Kết thúc Sử lý bài

	// Kiểm tra kết quả
	HU.findOne({game:'mini3cay', type:cuoc, red:red}, {}, function(err, data){
		let uInfo      = {};
		let mini_users = {};
		let huUpdate   = {bet:addQuy};

		let quyHu     = data.bet;
		let quyMin    = data.min+addQuy;
		let checkName = new RegExp("^" + user.name + "$", 'i');
		checkName     = checkName.test(data.name);

		if (checkName || (bo3 && bo3_a === 0)) {
			// NỔ HŨ (Bộ 3 Át Hoặc được xác định là nổ hũ)
			HU.updateOne({game:'mini3cay', type:cuoc, red:red}, {$set:{name:"", bet:quyMin}}).exec();
			if (checkName){
				// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
				card = [...base_card.card]
					.slice(0, 4);
				// tráo bài
				card = Helpers.shuffle(card); // tráo bài lần 1
				ketqua = card.slice(0, 3);
			}
			nohu = true;
			an   = Math.floor(quyHu-Math.ceil(quyHu*phe/100));
			text = 'Nổ Hũ';
			code = 6;
			if (red){
				huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     = 1; // Khởi tạo
				Helpers.ThongBaoNoHu(io, {title: "MINI 3 CÂY", name: user.name, bet: Helpers.numberWithCommas(an)});
			}else{
				huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 1; // Khởi tạo
			}
		}else if (Day && dongChat) {
			// x30    3 lá liên tiếp đồng chất
			an   = cuoc*30;
			text = 'Suốt';
			code = 5;
			red && Helpers.ThongBaoBigWin(io, {game: "MINI 3 CÂY", users: user.name, bet: Helpers.numberWithCommas(an), status: 2});
		}else if (bo3) {
			// x20      Sáp
			an   = cuoc*20;
			text = 'Sáp ' + (bo3_a+1);
			code = 4;
			red && Helpers.ThongBaoBigWin(io, {game: "MINI 3 CÂY", users: user.name, bet: Helpers.numberWithCommas(an), status: 2});
		}else if (ADiamond && TongDiem == 10) {
			// x10		Tổng 3 lá = 10, có Át rô
			an   = cuoc*10;
			text = '10 Điểm, A rô';
			code = 3;
		}else if (TongDiem == 10) {
			// x2.5		Tổng 3 lá = 10
			an   = cuoc*2.5;
			text = '10 Điểm';
			code = 2;
		}else if (TongDiem == 9) {
			// x2 		Tổng 3 lá = 9
			an   = cuoc*2;
			text = '9 Điểm';
			code = 1;
		}

		let tien = an-cuoc;
		uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
		huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = cuoc;     // Cập nhật Số Red đã chơi
		if (tien > 0){
			huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
		}
		if (tien < 0){
			huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
		}
		Mini3Cay_red.create({'uid': user.id, 'win': an, 'bet': cuoc, 'type': code, 'kq': ketqua, 'time': new Date()}, function(err) {});
		HU.updateOne({game:'mini3cay', type:cuoc, red:red}, {$inc:huUpdate}).exec();
		UserInfo.updateOne({id:user.id}, {$inc: uInfo}).exec();
		Mini3Cay_user.updateOne({'uid': user.id}, {$set:{time: new Date()}, $inc: mini_users}).exec();
	});
}

module.exports = function(io, listBot){
	if (listBot.length) {
		let max = Math.floor(listBot.length*17/100);
		listBot = Helpers.shuffle(listBot);
		listBot = listBot.slice(0, max);
		Promise.all(listBot.map(function(user){
			spin(io, user);
		}))
	}
};
