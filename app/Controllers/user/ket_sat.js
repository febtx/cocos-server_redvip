
const UserInfo = require('../../Models/UserInfo');

const Helper   = require('../../Helpers/Helpers');

function gui(client, red){
	red = red>>0;
	if (red < 10000) {
		client.send(JSON.stringify({notice:{title: "GỬI RED", text: "Số tiền gửi phải lớn hơn 10.000"}}));
	}else{
		UserInfo.findOne({id: client.UID}, 'red', function(err, user){
			if (user.red < red) {
				client.send(JSON.stringify({notice:{title: "THÔNG BÁO", text: "Số dư không khả dụng."}}));
			}else{
				UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red: -red, ketSat: red}}, function(err, cat){
					client.send(JSON.stringify({notice:{title:'THÀNH CÔNG', text: 'Đã gửi ' + Helper.numberWithCommas(red) + ' RED vào két sắt thành công.!!'}, user:{red:cat.red-red, ketSat: cat.ketSat+red}}));
				});
			}
		});
	}
}

function rut(client, red){
	red = red>>0;
	if (red < 10000) {
		client.send(JSON.stringify({notice:{title: "RÚT RED", text: "Số tiền rút phải lớn hơn 10.000"}}));
	}else{
		UserInfo.findOne({id: client.UID}, 'ketSat', function(err, user){
			if (user.ketSat < red) {
				client.send(JSON.stringify({notice:{title: "THẤT BẠI", text: "Số tiền trong két nhỏ hơn số tiền gian dịch."}}));
			}else{
				UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red: red, ketSat: -red}}, function(err, cat){
					client.send(JSON.stringify({notice:{title:'THÀNH CÔNG', text: 'Rút thành công ' + Helper.numberWithCommas(red) + ' RED từ két sắt.!!'}, user:{red: cat.red+red, ketSat: cat.ketSat-red}}));
				});
			}
		});
	}
}

module.exports = function(client, data) {
	if (void 0 !== data.gui) {
		gui(client, data.gui)
	}
	if (void 0 !== data.rut) {
		rut(client, data.rut)
	}
};
