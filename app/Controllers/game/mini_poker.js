
const miniPokerHu    = require('../../Models/miniPoker/miniPokerHu');
const miniPokerUsers = require('../../Models/miniPoker/miniPoker_users');

const miniPokerRed = require('../../Models/miniPoker/miniPokerRed');
const miniPokerXu  = require('../../Models/miniPoker/miniPokerXu');

const UserInfo  = require('../../Models/UserInfo');
const Helpers   = require('../../Helpers/Helpers');
const base_card = require('../../../data/card');

function spin(client, data){
	if (!!data && !!data.cuoc && !!data.red) {
		var bet = data.cuoc>>0; // Mức cược
		var red = !!data.red; // Loại tiền (Red: true, Xu: false)
		if (!(bet == 100 || bet == 1000 || bet == 10000)) {
			client.red({mini:{poker:{status:0}}, notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
		}else{
			UserInfo.findOne({id:client.UID}, 'red xu name', function(err, user){
				if (!user || (red && user.red < bet) || (!red && user.xu < bet)) {
					client.red({mini:{poker:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
				}else{
					var phe = red ? 2 : 4;    // Phế
					var addQuy = (bet*0.01)>>0;
					miniPokerHu.findOneAndUpdate({type:bet, red:red}, {$inc:{bet:addQuy}}, function(err,cat){});
					var an      = 0;
					var code    = 0;
					var text    = '';
					var thuong  = 0;
					var card    = [...base_card.card];
					// tráo bài
					card = Helpers.shuffle(card); // tráo bài lần 1
					card = Helpers.shuffle(card); // tráo bài lần 2
					card = Helpers.shuffle(card); // tráo bài lần 3
					//var lengthC = card.length;  // dùng bốc ngẫu nhiên

					//var ketqua  = [];            // bốc nhẫu nhiên
					var ketqua = card.slice(0, 5); // bốc 5 thẻ đầu tiên

					var arrT   = [];           // Mảng lọc các bộ 2 trong bài
					for (var i = 0; i < 5; i++) {
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
					//arrT.forEach(function(c, index){
					//});
					var type   = ketqua[0].type; // Kiểm tra đồng chất
					var dongChat = ketqua.filter(type_card => type_card.type == type);
					dongChat = dongChat.length == 5 ? true : false;  // Dây là đồng chất

					var AK   = ketqua.sort(function(a,b){return a.card - b.card});
					var DAK  = AK[4].card - AK[0].card === 4 && bo3 == false && bo2 == 0 && tuQuy == null ? true : false; // Dây từ A đến K
					var DAKj = false

					if (AK[0].card == 0 && bo3 == false && bo2 == 0 && tuQuy == null) {
						var KA = ketqua.sort(function(a,b){
							if (a.card == 0) {
								return 1;
							}else if(b.card == 0) {
								return -1;
							}else{
								return a.card - b.card
							}
						});
						DAKj = KA[3].card == 12 && KA[0].card == 9 ? true : false;
					}

					miniPokerHu.findOne({type:bet, red:red}, {}, function(err, data){
						var quyHu     = data.bet;
						var quyMin    = data.min;
						var checkName = new RegExp("^" + client.profile.name + "$", 'i');
						checkName     = checkName.test(data.name);

						if (checkName || (dongChat && (DAKj || (DAK && AK[4] > 9)))) {
							// NỔ HŨ (DÂY ĐỒNG CHẤT CỦA DÂY ĐẾN J TRỞ LÊN) Hoặc được xác định là nổ hũ
							miniPokerHu.findOneAndUpdate({type:bet, red:red}, {$set:{name:"", bet:quyMin}}, function(err,cat){});
							if (checkName){
								// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
								var randomType = (Math.random()*4)>>0;           // Ngẫu nhiên chất bài
								var randomMin  = ((Math.random()*(9-6+1))+6)>>0; // Ngẫu nhiên dây bài bắt đầu từ
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
							an   = quyHu;
							text = 'Nổ Hũ';
							code = 9;
							red && Helpers.ThongBaoNoHu(client, {title: "MINI POKER", name: client.profile.name, bet: quyHu});
						}else if ((DAK && dongChat) || (DAKj && !dongChat)) {
							// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT HOẶC DÂY ĐẾN A)
							an   = (bet*1000);
							text = 'Thắng Lớn';
							code = 8;
						}else if (tuQuy) {
							// x150     TỨ QUÝ (TỨ QUÝ)
							an   = (bet*150);
							text = 'Tứ Quý';
							code = 7;
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
						}else if (DAK && !dongChat) {
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

						an = (an-Math.ceil(an*phe/100))>>0; // Cắt phế 2% - 4% ăn được

						var tien = an-bet;
						var uInfo      = {};
						var mini_users = {};
						setTimeout(function(){
							if (red) {
								uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
								uInfo['redPlay'] = mini_users['bet'] = bet;     // Cập nhật Số Red đã chơi
								if (tien > 0){
									uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
								}
								if (tien < 0){
									uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
								}
								if (code == 9){
									uInfo['hu'] = mini_users['hu'] = 1;         // Cập nhật Số Hũ Red đã Trúng
								}
								miniPokerRed.create({'name': client.profile.name, 'win': an, 'bet': bet, 'type': code, 'kq': ketqua, 'time': new Date()}, function (err, small) {
									if (err){
										client.red({mini:{poker:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{poker:{status:1, card:ketqua, phien: small.id, win: an, text: text, code: code}}, user:{red: user.red-bet, xu: user.xu}});
									 }
								});
							}else{
								thuong = (an*0.039589)>>0;
								uInfo['xu'] = tien;         // Cập nhật Số dư XU trong tài khoản
								uInfo['xuPlay'] = mini_users['betXu'] = bet;     // Cập nhật Số XU đã chơi
								if (thuong > 0){
									uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong;  // Cập nhật Số dư xu trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
								}
								if (tien > 0){
									uInfo['xuWin'] = mini_users['winXu'] = tien;    // Cập nhật Số xu đã Thắng
								}
								if (tien < 0){
									uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số xu đã Thua
								}
								if (code == 9){
									uInfo['huXu'] = mini_users['huXu'] = 1;      // Cập nhật Số Hũ Xu đã Trúng
								}

								miniPokerXu.create({'name': client.profile.name, 'win': an, 'bet': bet, 'type': code, 'kq': ketqua, 'time': new Date()}, function (err, small) {
									if (err){
										client.red({mini:{poker:{status:0, notice: 'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{poker:{status:1, card:ketqua, phien: small.id, win: an, thuong: thuong, text: text, code: code}}, user:{red: user.red, xu: user.xu-bet}});
									}
								});
							}
							UserInfo.findOneAndUpdate({id:client.UID}, {$inc: uInfo}, function(err,cat){});
							miniPokerUsers.findOneAndUpdate({'uid': client.UID}, {$inc: mini_users}, function(err,cat){});
						}, 10);
					});
				}
			});
		}
	}
}

function log(client, data){
	if (!!data && !!data.page && !!data.red) {
		var page = data.page>>0; // trang
		var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
		if (page < 1) {
			client.red({notice:{text: "DỮ LIỆU KHÔNG ĐÚNG...", title: "MINI POKER"}});
		}else{
			var kmess = 8;
			var regex = new RegExp("^" + client.profile.name + "$", 'i');
			if (red) {
				miniPokerRed.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPokerRed.find({name: {$regex: regex}}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{poker:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else{
				miniPokerXu.countDocuments({name: {$regex: regex}}).exec(function(err, total){
					miniPokerXu.find({name: {$regex: regex}}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{poker:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}
		}
	}

}

function top(client, data){
	var red = !!data; // Loại tiền (Red: true, Xu: false)
	if (red) {
		miniPokerRed.find({$or:[
			{type:9},
			{type:8},
			{type:7}
		]}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{poker:{top:arrayOfResults}}});
			})
		});
	}else{
		miniPokerXu.find({$or:[
			{type:9},
			{type:8},
			{type:7}
		]}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{poker:{top:arrayOfResults}}});
			})
		});
	}
}

module.exports = function(client, data){
	if (!!data) {
		if (!!data.spin) {
			spin(client, data.spin)
		}
		if (!!data.log) {
			log(client, data.log)
		}
		if (void 0 !== data.top) {
			top(client, data.top)
		}
	};
}
