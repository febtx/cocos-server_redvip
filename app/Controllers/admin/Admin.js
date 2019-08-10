
const Admin   = require('../../Models/Admin');

var validator = require('validator');
const Helper  = require('../../Helpers/Helpers');

function first(client) {
	var data = {
		Authorized: true,
	};
	client.red(data);
	/**
	Admin.findOne({_id: client.UID}, function (err, d) {
		client.emit('p', {
			first: {username: d.username, rights: d.rights },
		});
		//taixiu: {time_remain: client.server.TaiXiu_time}
	});
	*/
}

function changePassword(client, data){
	if (!!data && !!data.password && !!data.newPassword && !!data.newPassword2) {
		if (!validator.isLength(data.password, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.newPassword, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.newPassword2, {min: 6, max: 32})) {
			client.red({notice: {title: "LỖI", text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		} else if (data.password == data.newPassword){
			client.red({notice: {title: "LỖI", text: 'Mật khẩu mới không trùng với mật khẩu cũ.!!'}});
		} else if (data.newPassword != data.newPassword2){
			client.red({notice: {title: "LỖI", text: 'Nhập lại mật khẩu không đúng!!'}});
		} else {
		}
	}
	var error = null;
	if (data.password.length > 32 || data.password.length < 5 || data.newPassword.length > 32 || data.newPassword.length < 5 || data.newPassword2.length > 32 || data.newPassword2.length < 5)
		error = 'Mật khẩu từ 5 - 32 kí tự...';
	else if (data.newPassword != data.newPassword2)
		error = 'Nhập lại mật khẩu không đúng...';
	else if (data.password == data.newPassword)
		error = 'Mật Khẩu mới không được trùng với mật khẩu cũ...';

	if (error) {
		client.red({notice:{title:'ĐỔI MẬT KHẨU',text:error}});
		return;
	}

	Admin.findOne({'_id': client.UID}, function(err, user){
		if (user !== null) {
			if (Helper.validPassword(data.password, user.password)) {
				Admin.findOneAndUpdate({'_id': client.UID}, {'password':Helper.generateHash(data.newPassword)}, function(err, cat){
					client.red({notice:{title:'ĐỔI MẬT KHẨU',text:'Đổi mật khẩu thành công.'}});
				});
			}else{
				client.red({notice:{title:'ĐỔI MẬT KHẨU',text:'Mật khẩu cũ không đúng.'}});
			}
		}
	});
}

function onData(client, data) {
	if (void 0 !== data.doi_pass) {
		changePassword(client, data.doi_pass)
	}
}

module.exports = {
	first: first,
	onData: onData,
}
