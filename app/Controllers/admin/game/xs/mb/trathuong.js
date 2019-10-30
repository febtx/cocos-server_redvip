
let xsmb      = require('../../../../../Models/XoSo/mb/xsmb');
let xsmb_cuoc = require('../../../../../Models/XoSo/mb/xsmb_cuoc');
let UserInfo  = require('../../../../../Models/UserInfo');

module.exports = function(client, date) {
	xsmb.findOne({date:date}, {}, function(err, data){
		if (!!data) {
			if (data.pay) {
				client.red({xs:{mb:{kq:{notice:'Phiên đã Trả thưởng...'}}}});
			}else{
				client.red({xs:{mb:{kq:{notice:'Trả thưởng thành công...'}}}});
				xsmb_cuoc.find({date:date}, {}, function(errC, cuoc){
					if (cuoc.length > 0) {
						// tách lô 2 số
						let lo2so = [data.g1.substring(data.g1.length-2), data.gdb.substring(data.gdb.length-2)];
						let temp2 = data.g2.map(function(obj){
							return obj.substring(obj.length-2);
						});
						let temp3 = data.g3.map(function(obj){
							return obj.substring(obj.length-2);
						});
						let temp4 = data.g4.map(function(obj){
							return obj.substring(obj.length-2);
						});
						let temp5 = data.g5.map(function(obj){
							return obj.substring(obj.length-2);
						});
						let temp6 = data.g6.map(function(obj){
							return obj.substring(obj.length-2);
						});
						let temp7 = data.g7.map(function(obj){
							return obj.substring(obj.length-2);
						});
						lo2so.concat(temp2, temp3, temp4, temp5, temp6, temp7);


						// tách lô 3 số
						let lo3so = [data.g1.substring(data.g1.length-3), data.gdb.substring(data.gdb.length-3)];
						temp2 = data.g2.map(function(obj){
							return obj.substring(obj.length-3);
						});
						temp3 = data.g3.map(function(obj){
							return obj.substring(obj.length-3);
						});
						temp4 = data.g4.map(function(obj){
							return obj.substring(obj.length-3);
						});
						temp5 = data.g5.map(function(obj){
							return obj.substring(obj.length-3);
						});
						temp6 = data.g6.map(function(obj){
							return obj.substring(obj.length-3);
						});
						lo3so.concat(temp2, temp3, temp4, temp5, temp6);


						// tách lô 4 số
						let lo4so = [data.g1.substring(data.g1.length-4), data.gdb.substring(data.gdb.length-4)];
						temp2 = data.g2.map(function(obj){
							return obj.substring(obj.length-4);
						});
						temp3 = data.g3.map(function(obj){
							return obj.substring(obj.length-4);
						});
						temp4 = data.g4.map(function(obj){
							return obj.substring(obj.length-4);
						});
						temp5 = data.g5.map(function(obj){
							return obj.substring(obj.length-4);
						});
						lo4so.concat(temp2, temp3, temp4, temp5, temp6);

						let de      = data.gdb.substring(data.gdb.length-2);
						let daude   = data.gdb.substring(0, 2);
						let degiai7 = data.g7.substring(data.g7.length-2)
						let degiai1 = data.g1.substring(data.g1.length-2)
						let cang3   = data.gdb.substring(data.gdb.length-3);
						let cang4   = data.gdb.substring(data.gdb.length-4);
						let dau     = data.gdb.charAt();
						let duoi    = data.gdb.charAt(data.gdb.length-1);

						cuoc.forEach(function(objC){
							let diem = objC.diem;
							let win = 0;
							console.log('start');
							objC.thanhtoan = true;
							switch(objC.type) {
								case 'lo2':
									// 'Lô 2 Số'
									console.log('start forEach');
									objC.so.forEach(function(so){
										lo2so.forEach(function(item2so){
											if (so === item2so) {
												win += diem*80000;
											}
										});
									});
									console.log('end forEach');
									break;
								case 'lo21k':
									// 'Lô 2 Số 1k'
									console.log('start forEach 1K');
									objC.so.forEach(function(so){
										lo2so.forEach(function(item2so){
											if (so === item2so) {
												win += diem*3636;
											}
										});
									});
									console.log('end forEach 1K');
									break;
								case 'lo3':
									// 'Lô 3 Số'
									break;
								case 'lo4':
									// 'Lô 4 Số'
									break;
								case 'xien2':
									// 'Xiên 2'
									break;
								case 'xien3':
									// 'Xiên 3'
									break;
								case 'xien4':
									// 'Xiên 4'
									break;
								case 'de':
									// data.gdb.substring(data.gdb.length-2);
									// 'Đề'
									break;
								case 'daude':
									// data.gdb.substring(0, 2);
									// 'Đầu Đề'
									break;
								case 'degiai7':
									// data.g7
									// 'Đề Giải 7'
									break;
								case 'degiai1':
									// data.g1
									// 'Đề Giải Nhất'
									break;
								case '3cang':
									// data.gdb.substring(data.gdb.length-3);
									// '3 Càng'
									break;
								case '4cang':
									// data.gdb.substring(data.gdb.length-4);
									// '4 Càng'
									break;
								case 'dau':
									// data.gdb.charAt();
									// 'Đầu'
									break;
								case 'duoi':
									// data.gdb.charAt(data.gdb.length-1);
									// 'Đuôi'
									break;
								case 'truot4':
									// 'Trượt 4'
									break;
								case 'truot8':
									// 'Trượt 8'
									break;
								case 'truot10':
									// 'Trượt 10'
									break;
							}
							console.log('end game');
							if (win > 0) {
								objC.win = win;
								UserInfo.updateOne({name:objC.name}, {$inc:{red:win}}).exec();
								//UserInfo.updateOne({name:objC.name});
							}
							objC.save();
						});
					}
				});
			}
		}else{
			client.red({xs:{mb:{kq:{notice:'Trả thưởng thất bại...'}}}});
		}
	});
}
