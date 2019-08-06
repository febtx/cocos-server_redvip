
const tabDaiLy   = require('../../../Models/DaiLy');
const tabNhaMang = require('../../../Models/NhaMang');
const tabMenhGia = require('../../../Models/MenhGia');

const Helper     = require('../../../Helpers/Helpers');

async function DaiLy_add(client, data){
	var name     = data.name;
	var nickname = data.nickname;
	var phone    = data.phone;
	var fb       = data.fb;
	if (Helper.isEmpty(name) || Helper.isEmpty(nickname) || Helper.isEmpty(phone) || Helper.isEmpty(fb)) {
		client.send(JSON.stringify({notice:{title:'ĐẠI LÝ',text:'Không bỏ trống các thông tin...'}}));
	}else{
		var regexNick = new RegExp("^" + nickname + "$", 'i');
		tabDaiLy.findOne({'nickname': {$regex: regexNick}} , async function(err, check){
			if (!!check) {
				client.send(JSON.stringify({notice:{title:'ĐẠI LÝ',text:'NICKNAME đã tồn tại...'}}));
			}else{
				try {
					const create = await tabDaiLy.create({'name':name, 'nickname':nickname, 'phone':phone, 'fb':fb});
					if (!!create) {
						tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
							client.send(JSON.stringify({daily:{data:data}, notice:{title:'ĐẠI LÝ',text:'Thêm đại lý thành công...'}}));
						});
					}
				} catch (err) {
					client.send(JSON.stringify({notice:{title:'ĐẠI LÝ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}}));
				}
			}
		});
	}
}

function DaiLy_remove(client, id){
	tabDaiLy.findOne({'_id': id}, function(err, data){
		if (data) {
			var active = tabDaiLy.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.send(JSON.stringify({daily:{data:data, remove:true}, notice:{title:'ĐẠI LÝ',text:'Xoá thành công...'}}));
				});
			})
		}else{
			tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
				client.send(JSON.stringify({daily:{data:data, remove:true}, notice:{title:'ĐẠI LÝ',text:'Đại lý không tồn tại...'}}));
			});
		}
	});
}

function DaiLy_get(client){
	tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
		client.send(JSON.stringify({daily:{data:data}}));
	});
}

function DaiLy(client, data){
	if (void 0 !== data.add) {
		DaiLy_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		DaiLy_remove(client, data.remove)
	}
	if (void 0 !== data.get_data) {
		DaiLy_get(client)
	}
}



function NhaMang_add(client, data){
	var name = data.name;
	var code = data.value;
	var nap  = !!data.nap;
	var mua  = !!data.mua;
	if (Helper.isEmpty(name) || (!nap && !mua)) {
		client.send(JSON.stringify({notice:{title:'THÊM NHÀ MẠNG',text:'Không bỏ trống các thông tin...'}}));
	}else{
		var regex = new RegExp("^" + name + "$", 'i');
		tabNhaMang.findOne({'name': {$regex: regex}, 'nap': nap, 'mua': mua} , async function(err, check){
			if (!!check) {
				client.send(JSON.stringify({notice:{title:'THÊM NHÀ MẠNG',text:'Nhà mạng đã tồn tại...'}}));
			}else{
				try {
					const create = await tabNhaMang.create({'name':name, 'value':code, 'nap':nap, 'mua':mua});
					if (!!create) {
						tabNhaMang.find({}, function(err, data){
							client.send(JSON.stringify({thecao:{nhamang:data}, notice:{title:'THÊM NHÀ MẠNG',text:'Thêm NHÀ MẠNG thành công...'}}));
						});
					}
				} catch (err) {
					client.send(JSON.stringify({notice:{title:'THÊM NHÀ MẠNG',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}}));
				}
			}
		});
	}
}
function NhaMang_remove(client, id){
	tabNhaMang.findOne({'_id': id}, function(err, check){
		if (check) {
			var active = tabNhaMang.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabNhaMang.find({}, function(err, data){
					client.send(JSON.stringify({thecao:{nhamang:data, remove: true}, notice:{title:'XOÁ NHÀ MẠNG',text:'Xoá thành công...'}}));
				});
			})
		}else{
			tabNhaMang.find({}, function(err, data){
				client.send(JSON.stringify({thecao:{nhamang:data, remove: true}, notice:{title:'XOÁ NHÀ MẠNG',text:'Nhà mạng không tồn tại...'}}));
			});
		}
	});
}

function NhaMang(client, data){
	if (void 0 !== data.add) {
		NhaMang_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		NhaMang_remove(client, data.remove)
	}
}

async function MenhGia_add(client, data){
	var name   = data.name;
	var values = data.values;
	var nap    = !!data.nap;
	var mua    = !!data.mua;
	if (Helper.isEmpty(name) || Helper.isEmpty(values) || (!nap && !mua)) {
		client.send(JSON.stringify({notice:{title:'THÊM MỆNH GIÁ',text:'Không bỏ trống các thông tin...'}}));
	}else{
		var regex = new RegExp("^" + name + "$", 'i');
		tabMenhGia.findOne({'name': {$regex: regex}, 'values': values, 'nap': nap, 'mua': mua} , async function(err, check){
			if (!!check) {
				client.send(JSON.stringify({notice:{title:'THÊM MỆNH GIÁ',text:'Mệnh giá đã tồn tại...'}}));
			}else{
				try {
					const create = await tabMenhGia.create({'name':name, 'values':values, 'nap':nap, 'mua':mua});
					if (!!create) {
						tabMenhGia.find({}, function(err, data){
							client.send(JSON.stringify({thecao:{menhgia:data}, notice:{title:'THÊM MỆNH GIÁ',text:'Thêm MỆNH GIÁ thành công...'}}));
						});
					}
				} catch (err) {
					client.send(JSON.stringify({notice:{title:'THÊM MỆNH GIÁ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}}));
				}
			}
		});
	}
}
function MenhGia_remove(client, id){
	tabMenhGia.findOne({'_id': id}, function(err, check){
		if (check) {
			var active = tabMenhGia.findOneAndRemove({'_id': id}).exec();
			Promise.all([active])
			.then(values => {
				tabMenhGia.find({}, function(err, data){
					client.send(JSON.stringify({thecao:{menhgia:data, remove: true}, notice:{title:'XOÁ MỆNH GIÁ',text:'Xoá thành công...'}}));
				});
			})
		}else{
			tabMenhGia.find({}, function(err, data){
				client.send(JSON.stringify({thecao:{menhgia:data, remove: true}, notice:{title:'XOÁ MỆNH GIÁ',text:'Mệnh giá không tồn tại...'}}));
			});
		}
	});
}

function MenhGia(client, data){
	if (void 0 !== data.add) {
		MenhGia_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		MenhGia_remove(client, data.remove)
	}
}

function thecao_get(client, data){
	var active = [];
	if (void 0 !== data.nhamang) {
		var active1 = new Promise((ketqua, loi)=>{
			tabNhaMang.find({}, function(err, data){
				ketqua({nhamang:data})
				//client.emit('p', {thecao:{nhamang:data}});
			});
		});
		active = [active1, ...active];
	}
	if (void 0 !== data.menhgia) {
		var active2 = new Promise((ketqua, loi)=>{
			tabMenhGia.find({}, function(err, data){
				ketqua({menhgia:data})
				//client.emit('p', {thecao:{menhgia:data}});
			});
		});
		active = [active2, ...active];
	}
	Promise.all(active).then(resulf => {
		var df = {};
		Promise.all(resulf.map(function(obj){
			df = Object.assign(df, obj);
			return true;
		})).then(resulf => {
			client.send(JSON.stringify({thecao: df}));
		})
	})
}

function onData(client, data) {
	if (void 0 !== data.daily) {
		DaiLy(client, data.daily)
	}
	if (void 0 !== data.nhamang) {
		NhaMang(client, data.nhamang)
	}
	if (void 0 !== data.menhgia) {
		MenhGia(client, data.menhgia)
	}
	if (void 0 !== data.thecao_get) {
		thecao_get(client, data.thecao_get)
	}
}

module.exports = {
	onData: onData,
}
