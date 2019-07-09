
const User    = require('./app/Models/Admin');
const socket  = require('./app/Controllers/admin/socket.js');

// Authenticate!
const authenticate = async function(client, data, callback) {
	var {username, password} = data;
	console.log(username)
	username = username.trim();
	password = password.trim();
	if (username.length > 32 || username.length < 5 || password.length > 32 || password.length < 5){
		callback({title: 'ĐĂNG KÝ', text: 'Thông tin Sai! (5-32 kí tự)'}, false);
		return;
	}
	if (username.match(new RegExp("^[a-zA-Z0-9]+$")) === null) {
		callback({title: 'ĐĂNG KÝ', text: 'Tên chỉ gồm kí tự và số !!'}, false);
		return;
	};

	try {
		var regex = new RegExp("^" + username + "$", 'i')
		var user = await User.findOne({'username': {$regex: regex}});
		if (user){
			if (user.validPassword(password)){
				client.UID = user._id;
				callback(false, true);
			}else{
				callback({title: 'ĐĂNG NHẬP', text: 'Sai mật khẩu!!'}, false);
			}
		}else{
			callback({title: 'ĐĂNG NHẬP', text: 'Tài khoản không tồn tại!!'}, false);
		}
	} catch (error) {
		callback({title: 'THÔNG BÁO', text: 'Có lỗi sảy ra, vui lòng kiểm tra lại!!'});
	}
};

module.exports = function(ws, redT){
	ws.auth = false;
	ws.UID  = null;
	var timeAuth = setTimeout(function() {
		if (!ws.auth) {
			ws.close();
		}
	}, 6e5);

	ws.on('message', function(message) {
		console.log(message)
		try {
			message = JSON.parse(message);
			if (this.auth == false && void 0 !== message.authentication) {
				clearTimeout(timeAuth);
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
						var data = JSON.stringify({unauth: err});
						ws.send(data);
						ws.close();
					} else {
						ws.send(JSON.stringify({unauth: {message: 'Authentication failure'}}));
						ws.close();
					}
				});
			}else if(!!this.auth){
				socket.message(this, message);
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
