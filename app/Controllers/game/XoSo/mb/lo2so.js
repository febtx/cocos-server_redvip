
module.exports = function(client, data){
	if (!!data.so && typeof data.so === 'string' && !!data.diem) {
		let diem = data.diem>>0;
		if (data.diem > 1000000) {
			var res = data.so.split(',');
			res = res.map(function(obj){
				obj = obj.trim();
				if (obj.length === 2) {
					return obj;
				}
				return void 0;
			});
			res = res.filter(function(obj){
				return obj !== void 0;
			});
			console.log(res);
			if (res.length === 0) {
				console.log('Số chọn không hợp lệ.');
			}else{
				//
			}
		}else{
			console.log('Số điểm tối đa là 1.000.000.');
		}
	}else{
		console.log('Dữ liệu không đúng.');
	}
	console.log(data);
};
