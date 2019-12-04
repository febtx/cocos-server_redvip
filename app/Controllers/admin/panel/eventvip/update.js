
let path = require('path');
let fs   = require('fs');

module.exports = function (client, data) {
	let file = require('../../../../../config/topVip.json');
	file.status  = !!data.status;
	file.begin_d = data.begin_d>>0;
	file.begin_m = data.begin_m>>0;
	file.begin_y = data.begin_y>>0;
	file.day     = data.day>>0;
	file.member  = data.member>>0;
	file.top1    = data.top1>>0;
	file.top2    = data.top2>>0;
	file.top3    = data.top3>>0;
	file.top4    = data.top4>>0;
	file.top5    = data.top5>>0;
	file.top6_10 = data.top6_10>>0;
	file.top10_20  = data.top10_20>>0;
	file.top20_50  = data.top20_50>>0;
	file.top50_100 = data.top50_100>>0;

	fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/config/topVip.json', JSON.stringify(file), function(err){
		if (!!err) {
			client.red({notice:{title:'THẤT BẠI', text:'Lưu thất bại...'}});
		}else{
			client.red({notice:{title:'THÀNH CÔNG', text:'Cập nhật thành công...'}});
		}
	});
}
