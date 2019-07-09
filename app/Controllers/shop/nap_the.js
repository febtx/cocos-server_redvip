
const tab_NapThe = require('../../Models/NapThe');
const NhaMang    = require('../../Models/NhaMang');
const MenhGia    = require('../../Models/MenhGia');

module.exports = function(client, data){
	var nhaMang = data.nhamang;
	var menhGia = data.menhgia;
	var maThe   = parseInt(data.mathe);
	var seri    = parseInt(data.seri);

	var check1 = NhaMang.findOne({name: nhaMang, nap: true}).exec();
	var check2 = MenhGia.findOne({name: menhGia, nap: true}).exec();

	Promise.all([check1, check2])
	.then(values => {
		if (!!values[0] && !!values[1] && !isNaN(maThe) && !isNaN(seri)) {
			tab_NapThe.findOne({'name':client.profile.name, 'nhaMang':nhaMang, 'menhGia':menhGia, 'maThe':maThe, 'seri':seri}, function(err, cart){
				if (cart !== null) {
					client.send(JSON.stringify({notice:{title:'NẠP THẺ',text:'Bạn đã yêu cầu nạp thẻ này trước đây.!!'}}));
				}else{
					tab_NapThe.create({'name':client.profile.name, 'nhaMang':nhaMang, 'menhGia':menhGia, 'maThe':maThe, 'seri':seri, 'time': new Date()});
					client.send(JSON.stringify({notice:{title:'NẠP THẺ',text:'Đã gửi yêu cầu nạp thẻ...' + "\n" + 'Giữ lại thẻ trong quá trình sử lý yêu cầu.'}}));
				}
			});
		}else{
			client.send(JSON.stringify({notice:{title:'NẠP THẺ',text:'Thẻ nạp không được hỗ trợ.!!'}}));
		}
	})
}
