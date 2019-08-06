
const UserInfo    = require('../../../Models/UserInfo');
const MuaThe      = require('../../../Models/MuaThe');
const MuaThe_card = require('../../../Models/MuaThe_card');

function get_data(client, data){
	var status = parseInt(data.status)
	var page   = parseInt(data.page);
	var kmess = 10;

	if (isNaN(status) || isNaN(page)) {
		return;
	}
	if (status == -1) {
		MuaThe.estimatedDocumentCount().exec(function(err, total){
			MuaThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
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
						client.red({mua_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
					})
				}else{
					client.red({mua_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
				}
			});
		});
	}else{
		var query = status == 0 ? {status: 0} : {status: {$gt: 0}};
		MuaThe.countDocuments(query).exec(function(err, total){
			MuaThe.find(query, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
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
						client.red({mua_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
					})
				}else{
					client.red({mua_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
				}
			});
		});
	}
}
function get_info(client, id){
	MuaThe_card.find({'cart': id}, 'maThe menhGia nhaMang seri time', function(err, data){
		client.red({mua_the:{get_info:{id:id, card: data}}});
	})
}

function update(client, data){
	var status = parseInt(data.status);
	var cart   = data.cart;

	MuaThe.findOneAndUpdate({'_id': cart}, {$set:{status: status}}, function(err, cart){});

	if (void 0 !== data.card) {
		Promise.all(data.card.map(function(obj){
			MuaThe_card.findOneAndUpdate({'_id': obj.id}, {$set: obj.card}, function(err, cart){});
		}))
	}
	client.red({mua_the:{update: data}});
}

function onData(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client, data.get_data)
	}
	if (void 0 !== data.get_info) {
		get_info(client, data.get_info)
	}
	if (void 0 !== data.update) {
		update(client, data.update)
	}
}

module.exports = {
	onData: onData,
}
