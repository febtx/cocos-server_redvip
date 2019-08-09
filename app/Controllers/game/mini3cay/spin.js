
const Mini3Cay_red  = require('../../../Models/Mini3Cay/Mini3Cay_red');
const Mini3Cay_xu   = require('../../../Models/Mini3Cay/Mini3Cay_xu');

const Mini3Cay_user = require('../../../Models/Mini3Cay/Mini3Cay_user');
const Mini3Cay_hu   = require('../../../Models/Mini3Cay/Mini3Cay_hu');

const UserInfo      = require('../../../Models/UserInfo');

const Helpers       = require('../../../Helpers/Helpers');
const base_card     = require('../../../../data/card');

module.exports = function(client, spin) {
	var cuoc = spin.cuoc>>0;  // Tiền cược
	var red  = !!spin.red;	  // Loại tiền đang chơi
	if (!(cuoc == 100 || cuoc == 1000 || cuoc == 10000)) {
		// Error
		client.send(JSON.stringify({mini:{bacay:{status:0,notice: "Quay thất bại..."}}}));
	}else{
		// Spin
		UserInfo.findOne({id:client.UID}, 'red xu name', function(err, user){
			if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
				client.send(JSON.stringify({mini:{bacay:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}}));
			}else{
				var phe = red ? 2 : 4;    // Phế
				var addQuy = (cuoc*0.01)>>0;
				// Sử lý bài
				var an      = 0;
				var code    = 0;
				var text    = '';
				var thuong  = 0;
				var nohu    = false;
				var card    = [...base_card.card]
					.slice(0, 36);
				// card.slice(0, 36)
				// tráo bài
				card = Helpers.shuffle(card); // tráo bài lần 1
				card = Helpers.shuffle(card); // tráo bài lần 2
				card = Helpers.shuffle(card); // tráo bài lần 3
				//var lengthC = card.length;  // dùng bốc ngẫu nhiên

				//var ketqua  = [];            // bốc nhẫu nhiên
				var ketqua = card.slice(0, 3); // bốc 3 thẻ đầu tiên

				var ADiamond = false;       // Có Át rô trong bài?

				var arrT   = [];           // Mảng lọc các bộ 2 trong bài
				for (var i = 0; i < 3; i++) {
					//var max = lengthC-(i+1);
					//var random_card = Math.round(Math.random()*max);         // Chuẩn:       làm chòn đến giá trị gần nhất
					//var random_card = Math.floor(Math.random()*(lengthC-i)); // Không chuẩn: làm chòn về giá trị nhỏ nhất
					//ketqua[i] = card[random_card]; // bốc ngẫu nhiên
					var dataT = ketqua[i];
					//card.splice(random_card, 1); // Xoá thẻ - dùng cho bốc ngẫu nhiên, tránh trùng lặp
					if (void 0 === arrT[dataT.card]) {
						arrT[dataT.card] = 1;
					}else{
						arrT[dataT.card] += 1;
					}
					if (dataT.card == 0 && dataT.type == 1) {
						ADiamond = true; // có Át rô trong bài.
					}
				}

				var bo3     = false; // bộ ba (Kết quả có phải là bộ 3?)
				var bo3_a   = null;  // Tên bộ 3
				Promise.all(arrT.map(function(c, index){
					if (c === 3) {
						bo3   = true;
						bo3_a = index;
					}
				}))

				var type     = ketqua[0].type;                                     // Lấy ra chất đầu tiên trong bài
				var dongChat = ketqua.filter(type_card => type_card.type == type); // Lọc đồng chất
				dongChat     = dongChat.length == 3 ? true : false;                // Dây là đồng chất

				var TongDiem = (ketqua[0].card + ketqua[1].card + ketqua[2].card + 3)%10;     // Tổng điểm
				TongDiem = TongDiem === 0 ? 10 : TongDiem;
				var LienTiep   = ketqua.sort(function(a,b){return a.card - b.card});
				var Day        = LienTiep[2].card - LienTiep[0].card === 2 && LienTiep[2].card != LienTiep[1].card && LienTiep[1].card != LienTiep[0].card ? true : false; // Bộ liên tiếp

				// Kết thúc Sử lý bài

				// Kiểm tra kết quả
				Mini3Cay_hu.findOne({type:cuoc, red:red}, {}, function(err, data){
					var quyHu     = data.bet;
					var quyMin    = data.min+addQuy;
					var checkName = new RegExp("^" + client.profile.name + "$", 'i');
					checkName     = checkName.test(data.name);

					if (checkName || (bo3 && bo3_a === 0)) {
						// NỔ HŨ (Bộ 3 Át Hoặc được xác định là nổ hũ)
						Mini3Cay_hu.findOneAndUpdate({type:cuoc, red:red}, {$set:{name:"", bet:quyMin}}, function(err,cat){});
						if (checkName){
							// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
							card = [...base_card.card]
								.slice(0, 4);
							// tráo bài
							card = Helpers.shuffle(card); // tráo bài lần 1
							card = Helpers.shuffle(card); // tráo bài lần 2
							card = Helpers.shuffle(card); // tráo bài lần 3
							ketqua = card.slice(0, 3);
						}
						nohu = true;
						an   = quyHu;
						text = 'Nổ Hũ';
						code = 6;
						red && Helpers.ThongBaoNoHu(client, {title: "MINI 3 CÂY", name: client.profile.name, bet: quyHu});
					}else if (Day && dongChat) {
						// x30    3 lá liên tiếp đồng chất
						an   = cuoc*30;
						text = 'Suốt';
						code = 5;
					}else if (bo3) {
						// x20      Sáp
						an   = cuoc*20;
						text = 'Sáp ' + (bo3_a+1);
						code = 4;
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
					if (!nohu) {
						Mini3Cay_hu.findOneAndUpdate({type:cuoc, red:red}, {$inc:{bet:addQuy}}, function(err,cat){});
					}

					an = (an-Math.ceil(an*phe/100))>>0; // Cắt phế 2% - 4% ăn được

					var tien = an-cuoc;

					var uInfo      = {};
					var mini_users = {};

					if (red){
						uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
						uInfo['redPlay'] = mini_users['bet'] = cuoc;     // Cập nhật Số Red đã chơi
						if (tien > 0){
							uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
						}
						if (tien < 0){
							uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
						}
						if (!!nohu){
							uInfo['hu'] = mini_users['hu'] = 1;         // Cập nhật Số Hũ Red đã Trúng
						}
						Mini3Cay_red.create({'uid': client.UID, 'win': an, 'bet': cuoc, 'type': code, 'kq': ketqua, 'time': new Date()}, function (err, small) {});
						client.send(JSON.stringify({mini:{bacay:{status:1, card:ketqua, win: an, text: text, code: code}}, user:{red: user.red-cuoc, xu: user.xu}}));
					} else{
						thuong = (an*0.039589)>>0;
						uInfo['xu'] = tien;         // Cập nhật Số dư XU trong tài khoản
						uInfo['xuPlay'] = mini_users['betXu'] = cuoc;     // Cập nhật Số XU đã chơi
						if (thuong > 0){
							uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong;  // Cập nhật Số dư Red trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
						}
						if (tien > 0){
							uInfo['xuWin'] = mini_users['winXu'] = tien;    // Cập nhật Số Red đã Thắng
						}
						if (tien < 0){
							uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số Red đã Thua
						}
						if (!!nohu){
							uInfo['huXu'] = mini_users['huXu'] = 1;      // Cập nhật Số Hũ Xu đã Trúng
						}
						Mini3Cay_xu.create({'uid': client.UID, 'win': an, 'bet': cuoc, 'type': code, 'kq': ketqua, 'time': new Date()}, function (err, small) {});
						client.send(JSON.stringify({mini:{bacay:{status:1, card:ketqua, win: an, thuong: thuong, text: text, code: code}}, user:{red: user.red, xu: user.xu-cuoc}}));
					}

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc: uInfo}, function(err,cat){});
					Mini3Cay_user.findOneAndUpdate({'uid': client.UID}, {$inc: mini_users}, function(err,cat){});
				});
			}
		});
	}
};
