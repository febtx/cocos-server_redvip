
const Users    = require('../../../Models/Users');
const UserInfo = require('../../../Models/UserInfo');

const Helper   = require('../../../Helpers/Helpers');

function get_users(client, data){
	var page  = Math.abs(parseInt(data.page));
	var kmess = 10

	if (!isNaN(page) && page > 0) {
		if (void 0 === data.find) {
			UserInfo.estimatedDocumentCount().exec(function(err, total){
				UserInfo.find({}, 'id UID name red xu joinedOn phone', {sort:{'UID':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								Users.findOne({'_id': obj.id}, function(error, result2){
									var temp = obj._doc
									delete temp._id;
									temp['username'] = result2.local.username;
									resolve(temp)
								})
							})
						}))
						.then(function(data){
							client.send(JSON.stringify({users:{get_users:{data:data, page:page, kmess:kmess, total:total}}}));
						})
					}else{
						client.send(JSON.stringify({users:{get_users:{data:[], page:1, kmess:10, total:0}}}));
					}
				});
			});
		}else{
			var find = data.find;
			if (find.length) {
				var regex = new RegExp("" + data.find + "", "i");
				UserInfo.countDocuments({"name": {$regex: regex}}).exec(function(err, total){
					UserInfo.find({"name": {$regex: regex}}, 'id UID name red xu joinedOn phone', {sort:{'UID':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								return new Promise(function(resolve, reject) {
									Users.findOne({'_id': obj.id}, function(error, result2){
										var temp = obj._doc
										delete temp._id;
										temp['username'] = result2.local.username;
										resolve(temp)
									})
								})
							}))
							.then(function(data){
								client.send(JSON.stringify({users:{get_users:{data:data, page:page, kmess:kmess, total:total}}}));
							})
						}else{
							client.send(JSON.stringify({users:{get_users:{data:[], page:1, kmess:10, total:0}}}));
						}
					});
				});
			}
		}
	}
}

function get_info(client, id){
	var active = [];
	var active1 = new Promise((resolve, reject)=>{
		UserInfo.findOne({'id': id}, function(err, result) {
			if (!!result) {
				Users.findOne({'_id': result.id}, function(error, result2){
					var temp = result._doc
					delete temp._id;
					temp['username'] = result2.local.username;
					resolve(temp)
				})
			}else{
				reject('RedT Err!!');
			}
		});
	});
	active = [...active, active1];
	Promise.all(active).then(resulf => {
		client.send(JSON.stringify({users:{get_info:{profile:resulf[0]}}}));
		/**
		var df = {};
		Promise.all(resulf.map(function(obj){
			df = Object.assign(df, obj);
			return true;
		})).then(resulf => {
			client.send(JSON.stringify({thecao: df}));
		})
		*/
	}, reason => {
  		console.log(reason);
	})
}

function updateUser(client, data){
	var id = data.id;
	var pass = null;
	var error = null;
	var update = data.data.users;
	if (void 0 !== data.data.pass) {
		pass = data.data.pass;
		if (pass.length > 32 || pass.length < 5) {
			error = 'Mật khẩu từ 5 - 32 kí tự...';
		}
	}
	if (!!error) {
		client.send(JSON.stringify({notice:{title:'ĐỔI MẬT KHẨU', text:error}}));
		return void 0;
	}else{
		UserInfo.findOne({'id': id}, function(err, check) {
			if (check) {
				!!pass && Users.findOneAndUpdate({'_id': id}, {$set:{'local.password':Helper.generateHash(pass)}}, function(err, cart){});
				UserInfo.findOneAndUpdate({'id': id}, {$set:update}, function(err, cart){
					get_info(client, id);
					client.send(JSON.stringify({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}}));
				});
			}else{
				client.send(JSON.stringify({notice:{title:'NGƯỜI DÙNG', text:'Người dùng không tồn tại...'}}));
			}
		})
	}
}
function onData(client, data) {
	if (void 0 !== data.get_info) {
		get_info(client, data.get_info)
	}
	if (void 0 !== data.get_users) {
		get_users(client, data.get_users)
	}
	if (void 0 !== data.update) {
		updateUser(client, data.update)
	}
}

module.exports = {
	onData: onData,
}
