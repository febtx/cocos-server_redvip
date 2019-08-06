
const NapThe      = require('../../Models/NapThe');

const MuaThe      = require('../../Models/MuaThe');
const MuaThe_card = require('../../Models/MuaThe_card');

const MuaXu       = require('../../Models/MuaXu');
const ChuyenRed   = require('../../Models/ChuyenRed');

const Helper      = require('../../Helpers/Helpers');

function historyNapRed(client, data){
	var page  = data.page>>0;
	var kmess = 10;
	if (page > 0) {
		NapThe.countDocuments({'uid': client.UID}).exec(function(err, total){
			NapThe.find({'uid': client.UID}, 'GD menhGia nhaMang nhan seri status time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({profile:{history:{nap_red:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}
}

function historyMuaThe(client, data){
	var page  = data.page>>0
	var kmess = 10;
	if (page > 0) {
		MuaThe.countDocuments({'uid': client.UID}).exec(function(err, total){
			MuaThe.find({'uid': client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({profile:{history:{mua_the:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}
}

function historyMuaXu(client, data){
	var page  = data.page>>0
	var kmess = 10;
	if (page > 0) {
		MuaXu.countDocuments({uid: client.UID}).exec(function(err, total){
			MuaXu.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({profile:{history:{mua_xu:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}
}

function historyChuyenRed(client, data){
	var page  = data.page>>0
	var kmess = 10;
	if (page > 0) {
		var regex = new RegExp("^" + client.profile.name + "$", 'i')
		ChuyenRed.countDocuments({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}).exec(function(err, total){
			ChuyenRed.find({$or:[{'from':{$regex: regex}}, {'to':{$regex: regex}}]}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				client.send(JSON.stringify({profile:{history:{chuyen_red:result, page:page, kmess:kmess, total:total}}}));
			});
		});
	}
}

function the_cao(client, id){
	MuaThe.findOne({'_id': id, 'uid': client.UID}, function(err, card) {
		if (!!card) {
			MuaThe_card.find({'cart': id}, function(err, data){
				client.send(JSON.stringify({profile:{the_cao:data}}));
			});
		}
	});
}

function onHistory(client, data) {
	if (void 0 !== data.nap_red) {
		historyNapRed(client, data.nap_red)
	}

	if (void 0 !== data.mua_the) {
		historyMuaThe(client, data.mua_the)
	}

	if (void 0 !== data.mua_xu) {
		historyMuaXu(client, data.mua_xu)
	}

	if (void 0 !== data.chuyen_red) {
		historyChuyenRed(client, data.chuyen_red)
	}

	if (void 0 !== data.the_cao) {
		the_cao(client, data.the_cao)
	}
}

module.exports = onHistory;