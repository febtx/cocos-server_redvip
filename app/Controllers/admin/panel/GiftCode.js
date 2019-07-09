
const shortid  = require('shortid');
const GiftCode = require('../../../Models/GiftCode');

function get_data(client, data){
	var page  = data.page>>0;
	var kmess = 10;
	if (page < 1) {
		return;
	}
	GiftCode.countDocuments({}).exec(function(err, total){
		GiftCode.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
			client.send(JSON.stringify({giftcode:{get_data:{data:result, page:page, kmess:kmess, total:total}}}));
		});
	});
}

function get_gift(client){
	client.send(JSON.stringify({giftcode:{get_gift:shortid.generate()}}));
}

function create_gift(client, data){
	var giftcode = data.giftcode.trim();
	var red      = data.red>>0;
	var xu       = data.xu>>0;
	var type     = data.chung.trim();
	var ngay     = (data.ngay>>0)+1;
	var thang    = data.thang-1;
	var nam      = data.nam>>0;

	var checkG = new RegExp("^" + giftcode + "$", 'i');
	GiftCode.findOne({'code': {$regex: checkG}}, async function(err, check) {
		if (!!check) {
			client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Mã GiftCode đã tồn tại...'}}));
		}else{
			try {
				var gift = await GiftCode.create({'code':giftcode, 'red':red, 'xu':xu, 'type':type, 'date': new Date(), 'todate': new Date(nam, thang, ngay)});
				if (!!gift){
					GiftCode.countDocuments({}).exec(function(err, total){
						GiftCode.find({}, {}, {sort:{'_id':-1}, skip: 0, limit: 10}, function(err, result) {
							client.send(JSON.stringify({giftcode:{get_data:{data:result, page:1, kmess:10, total:total}}, notice:{title:'TẠO GIFTCODE',text:'Tạo gift code thành công...'}}));
						});
					});
				}
			} catch (error) {
				client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Mã GiftCode đã tồn tại...'}}));
			}
		}
	})
}

function remove(client, id){
	GiftCode.findOne({'_id': id}, function(err, check) {
		if (!!check) {
			var active = GiftCode.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				GiftCode.countDocuments({}).exec(function(err, total){
					GiftCode.find({}, {}, {sort:{'_id':-1}}, function(err, data){
						client.send(JSON.stringify({giftcode:{get_data:{data:data, page:1, kmess:10, total:total}}, notice:{title:'GIFT CODE',text:'Xoá thành công...'}}));
					});
				});
			})
		}else{
			GiftCode.countDocuments({}).exec(function(err, total){
				GiftCode.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.send(JSON.stringify({giftcode:{get_data:{data:data, page:1, kmess:10, total:total}}, notice:{title:'GIFT CODE',text:'Gift code không tồn tại...'}}));
				});
			});
		}
	})
}

function checkMid(client, mid){
	GiftCode.findOne({'type': mid}, function(err, check) {
		if (!!check) {
			client.send(JSON.stringify({notice:{title:'GIFT CODE',text:'Mã Chung đã tồn tại...'}}));
		}else{
			client.send(JSON.stringify({notice:{title:'GIFT CODE',text:'Mã Chung không tồn tại...'}}));
		}
	})
}

function onData(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client, data.get_data)
	}

	if (void 0 !== data.get_gift) {
		get_gift(client, data.get_gift)
	}

	if (void 0 !== data.create_gift) {
		create_gift(client, data.create_gift)
	}

	if (void 0 !== data.checkGift) {
		//checkGift(client, data.checkGift)
	}
	if (void 0 !== data.checkMid) {
		checkMid(client, data.checkMid)
	}

	if (void 0 !== data.remove) {
		remove(client, data.remove)
	}
}

module.exports = {
	onData: onData,
}
