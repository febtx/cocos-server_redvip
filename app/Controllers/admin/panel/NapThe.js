
var NapThe   = require('../../../Models/NapThe');
var MenhGia  = require('../../../Models/MenhGia');
var UserInfo = require('../../../Models/UserInfo');

function get_data(client, data){
	if (!!data && !!data.page) {
		var status = data.status>>0;
		var page   = data.page>>0;
		var kmess  = 10;

		if (page > 0) {
			if (status == -1) {
				NapThe.estimatedDocumentCount().exec(function(err, total){
					NapThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								var user = UserInfo.findOne({id: obj.uid}, 'name').exec();
								return Promise.all([user]).then(values => {
									Object.assign(obj, values[0]._doc);
									delete obj.__v;
									delete obj._id;
									delete obj.uid;
									return obj;
								});
							}))
							.then(function(arrayOfResults) {
								client.red({nap_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							})
						}else{
							client.red({nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
						}
					});
				});
			}else{
				var query = status == 0 ? {status: 0} : {status: {$gt: 0}};
				NapThe.countDocuments(query).exec(function(err, total){
					NapThe.find(query, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								var user = UserInfo.findOne({id: obj.uid}, 'name').exec();
								return Promise.all([user]).then(values => {
									Object.assign(obj, values[0]._doc);
									delete obj.__v;
									delete obj._id;
									delete obj.uid;
									return obj;
								});
							}))
							.then(function(arrayOfResults) {
								client.red({nap_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							})
						}else{
							client.red({nap_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
						}
					});
				});
			}
		}
	}
}

function update(client, data){
	if (!!data && !!data.id) {
		var status = data.status>>0;
		var id     = data.id;

		NapThe.findOne({'_id': id}, 'name nhaMang menhGia maThe seri nhan status', function(err, check){
			if (check) {
				if (check.status == status) {
					client.red({notice:{title: 'CHÚ Ý', text: 'Không Thể Cập Nhật...' + "\n" + 'Vì Thẻ Cào Đang trong trạng thái được chọn...'}});
				}else{
					if (status == 1) {
						MenhGia.findOne({'name': check.menhGia, 'nap': true}, 'values', function(err, checkMenhGia){
							if (!!checkMenhGia) {
								NapThe.updateOne({'_id': id}, {$set:{nhan: checkMenhGia.values, status: status}}).exec();
								UserInfo.updateOne({name: check.name}, {$inc:{red: checkMenhGia.values}}).exec();
								client.red({notice:{title: "THÔNG TIN NẠP THẺ", text: "Cập nhật thành công..."},nap_the:{update:{id: id, status: status, nhan: checkMenhGia.values}}});
							}else{
								client.red({notice:{title: 'LỖI HỆ THỐNG', text: 'Mệnh giá này không tồn tại trên hệ thống...'}});
							}
						});
					}else{
						if (check.status == 1) {
							NapThe.updateOne({'_id': id}, {$set:{nhan: 0, status: status}}).exec();
							UserInfo.updateOne({name: check.name}, {$inc:{red: -check.nhan}}).exec();
						}else{
							NapThe.updateOne({'_id': id}, {$set:{status: status}}).exec();
						}
						client.red({notice:{title: "THÔNG TIN NẠP THẺ", text: "Cập nhật thành công..."}, nap_the:{update:{id: id, status: status, nhan: 0}}});
					}
				}
			}
		})
	}
}

module.exports = function(client, data) {
	if (!!data) {
		if (!!data.get_data) {
			get_data(client, data.get_data)
		}
		if (!!data.update) {
			update(client, data.update)
		}
	}
}
