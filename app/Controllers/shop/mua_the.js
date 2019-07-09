
const MuaThe        = require('../../Models/MuaThe');
const MuaThe_thenap = require('../../Models/MuaThe_card');
const UserInfo  = require('../../Models/UserInfo');

const NhaMang       = require('../../Models/NhaMang');
const MenhGia       = require('../../Models/MenhGia');

module.exports = function(client, data){
	var nhaMang = data.nhamang;
	var menhGia = data.menhgia;
	var soluong = data.soluong>>0;
	//var otp     = data.otp;

	var check1 = NhaMang.findOne({name: nhaMang, mua: true}).exec();
	var check2 = MenhGia.findOne({name: menhGia, mua: true}).exec();

	Promise.all([check1, check2])
	.then(values => {
		if (!!values[0] && !!values[1] && soluong > 0 && soluong < 4) {
			var totall = values[1].values*soluong;
			UserInfo.findOne({id: client.UID}, 'red name', function(err, check){
				if (check == null || check.red <= totall) {
					client.send(JSON.stringify({notice:{title:'MUA THẺ',text:'Số dư không khả dụng.!!'}}));
				}else{
					UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-totall}}, function(err, user){
						client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Yêu cầu mua thẻ thành công.!!'}, user:{red: user.red-totall}}));
					});
					MuaThe.create({'name':client.profile.name, 'nhaMang':nhaMang, 'menhGia':menhGia, 'soLuong':soluong, 'Cost':totall, 'time': new Date()},
						function (err, data) {
		  					if (data) {
								while(soluong > 0){
									MuaThe_thenap.create({'cart':data._id, 'nhaMang':nhaMang, 'menhGia':menhGia});
									soluong--;
								}
		  					}
						}
					);
				}
			});
		}else{
			client.send(JSON.stringify({notice:{title:'MUA THẺ', text:'Thông tin không đúng.!!'}}));
		}
	})
}
