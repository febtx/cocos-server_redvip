
let TopVip = require('../../../../Models/VipPoint/TopVip');
let path   = require('path');
let fs     = require('fs');

module.exports = function (client) {
	let file = require('../../../../../config/topVip.json');
	if (!file.status) {
		client.red({notice:{title:'THẤT BẠI', text:'Lỗi: Sự kiện chưa được kích hoạt...'}});
	}else{
		let time    = new Date();
		//let timeStart = new Date(file.begin_y, file.begin_m-1, file.begin_d);
		let timeEnd = new Date(file.begin_y, file.begin_m-1, file.begin_d);
		timeEnd.setDate(timeEnd.getDate()+file.day+1);

		time    = time.getTime();
		timeEnd = timeEnd.getTime();
		if (time >= timeEnd) {
			file.status = false;
			fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/config/topVip.json', JSON.stringify(file), function(err){});
			client.red({eventvip:file, notice:{title:'THÀNH CÔNG', text:'Trả thưởng thành công...'}});

			// Trả thưởng
			TopVip.find({}, {}, {sort:{'vip':-1}, limit:file.member}, function(err, result){
				result.forEach(function(user, index){
					if (index === 0) {
					}else if(index === 1){
					}else if(index === 2){
					}else if(index === 3){
					}else if(index === 4){
					}else if(index > 4 && index <= 9){
					}else if(index > 9 && index <= 19){
					}else if(index > 19 && index <= 49){
					}else if(index > 49){
					}
				});
				file = null;
				TopVip.deleteMany({}).exec();
			});
		}else{
			client.red({notice:{title:'THẤT BẠI', text:'Không thể trả thưởng khi sự kiện chưa kết thúc...'}});
		}
	}
}
