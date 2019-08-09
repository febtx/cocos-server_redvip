
var validator = require('validator');
var User    = require('./app/Models/Admin');
var socket  = require('./app/Controllers/admin/socket.js');

// Authenticate!
var authenticate = async function(client, data, callback) {
	if (!!data && !!data.username && !!data.password) {
		var username = data.username;
		var password = data.password;
		var az09     = new RegExp("^[a-zA-Z0-9]+$");
		var testName = az09.test(username);

		if (validator.isLength(username, {min: 3, max: 32})) {
			callback({title: 'ĐĂNG NHẬP', text: 'Tài khoản (3-32 kí tự).'}, false);
		}else if (validator.isLength(password, {min: 5, max: 32})) {
			callback({title: 'ĐĂNG NHẬP', text: 'Mật khẩu (6-32 kí tự)'}, false);
		}else if (!testName) {
			callback({title: 'ĐĂNG NHẬP', text: 'Tên đăng nhập chỉ gồm kí tự và số !!'}, false);
		} else {
			try {
				var regex = new RegExp("^" + username + "$", 'i')
				var user = await User.findOne({'username': {$regex: regex}});
				if (user){
					if (user.validPassword(password)){
						client.UID = user._id.toString();
						callback(false, true);
					}else{
						callback({title: 'ĐĂNG NHẬP', text: 'Sai mật khẩu!!'}, false);
					}
				}else{
					callback({title: 'ĐĂNG NHẬP', text: 'Tài khoản không tồn tại!!'}, false);
				}
			} catch (error) {
				callback({title: 'THÔNG BÁO', text: 'Có lỗi sảy ra, vui lòng kiểm tra lại!!'}, false);
			}
		}
	}
};

module.exports = function(ws, redT){
	ws.admin = true;
	ws.auth = false;
	ws.UID  = null;

	ws.red = function(data){
		try {
			this.readyState == 1 && this.send(JSON.stringify(data));
		} catch(err) {}
	}

	ws.on('message', function(message) {
		console.log(message)
		try {
			if (!!message) {
				message = JSON.parse(message);
				if (this.auth == false && !!message.authentication) {
					authenticate(this, message.authentication, function(err, success) {
						if (success) {
							ws.auth = true;
							ws.redT = redT;
							if (void 0 !== ws.redT.admins[ws.UID]) {
								ws.redT.admins[ws.UID].push(ws);
							}else{
								ws.redT.admins[ws.UID] = [];
								ws.redT.admins[ws.UID].push(ws);
							}
							socket.auth(ws);
						} else if (!!err) {
							ws.red({unauth: err});
						} else {
							ws.red({unauth: {message: 'Authentication failure'}});
						}
					});
				}else if(!!this.auth){
					socket.message(this, message);
				}
			}
		} catch (error) {
			console.log(error)
		}
	});

	ws.on('close', function(message) {
		if (this.UID !== null) {
			if (void 0 !== this.redT.admins[this.UID]) {
				if (this.redT.admins[this.UID].length == 1) {
					delete this.redT.admins[this.UID];
				}else{
					var self = this;
					Promise.all(this.redT.admins[this.UID].map(function(obj, index){
						if (obj === self) {
							self.redT.admins[self.UID].splice(index, 1);
						}
					}));
				}
			}
		}
		this.auth = false;
	});
}