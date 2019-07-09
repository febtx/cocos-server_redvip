
const NapThe   = require('../../../Models/NapThe');
const MenhGia  = require('../../../Models/MenhGia');
const UserInfo = require('../../../Models/UserInfo');

function get_data(client, data){
	var status = parseInt(data.status)
	var page   = parseInt(data.page);
	var kmess = 10;

	if (isNaN(status) || isNaN(page) || page < 1) {
		return;
	}
	if (status == -1) {
		NapThe.estimatedDocumentCount().exec(function(err, total){
			NapThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}else{
		var query = status == 0 ? {status: 0} : {status: {$gt: 0}};
		NapThe.countDocuments(query).exec(function(err, total){
			NapThe.find(query, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}
}

function update(client, data){
	var status = parseInt(data.status);
	var id     = data.id;

	if (!isNaN(status) && !!id) {
		NapThe.findOne({'_id': id}, 'name nhaMang menhGia maThe seri nhan status', function(err, check){
			if (check) {
				if (check.status == status) {
					client.send(JSON.stringify({notice:{title: 'CHÚ Ý', text: 'Không Thể Cập Nhật...' + "\n" + 'Vì Thẻ Cào Đang trong trạng thái được chọn...'}}));
				}else{
					if (status == 1) {
						MenhGia.findOne({'name': check.menhGia, 'nap': true}, 'values', function(err, checkMenhGia){
							if (!!checkMenhGia) {
								NapThe.findOneAndUpdate({'_id': id}, {$set:{nhan: checkMenhGia.values, status: status}}, function(err, cat){});
								UserInfo.findOneAndUpdate({name: check.name}, {$inc:{red: checkMenhGia.values}}, function(err,cat){});
								client.send(JSON.stringify({notice:{title: "THÔNG TIN NẠP THẺ", text: "Cập nhật thành công..."},nap_the:{update:{id: id, status: status, nhan: checkMenhGia.values}}}));
							}else{
								client.send(JSON.stringify({notice:{title: 'LỖI HỆ THỐNG', text: 'Mệnh giá này không tồn tại trên hệ thống...'}}));
							}
						});
					}else{
						if (check.status == 1) {
							NapThe.findOneAndUpdate({'_id': id}, {$set:{nhan: 0, status: status}}, function(err, cat){});
							UserInfo.findOneAndUpdate({name: check.name}, {$inc:{red: -check.nhan}}, function(err,cat){});
						}else{
							NapThe.findOneAndUpdate({'_id': id}, {$set:{status: status}}, function(err, cat){});
						}
						client.send(JSON.stringify({notice:{title: "THÔNG TIN NẠP THẺ", text: "Cập nhật thành công..."}, nap_the:{update:{id: id, status: status, nhan: 0}}}));
					}
				}
			}
		})
	}
}

function onData(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client, data.get_data)
	}
	if (void 0 !== data.update) {
		update(client, data.update)
	}
}

module.exports = {
	onData: onData,
}
