
const User    = require('./app/Models/Users');
const helpers = require('./app/Helpers/Helpers');
const socket  = require('./app/socket.js');
const captcha = require('./captcha');

// Authenticate!
const authenticate = async function(client, data, callback) {
	var { username, password, register} = data;
	username = username.trim();
	password = password.trim();
	if (username.length > 32 || username.length < 3 || password.length > 32 || password.length < 6){
		captcha(client, 'signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Thông tin Sai! (6-32 kí tự)'}, false);
	}else if (username.match(new RegExp("^[a-zA-Z0-9]+$")) === null) {
		captcha(client, 'signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Tên chỉ gồm kí tự và số !!'}, false);
	}else if (username == password) {
		captcha(client, 'signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Tài khoản không được trùng với mật khẩu!!'}, false);
	}else{
		try {
			var regex = new RegExp("^" + username + "$", 'i');
			// Đăng Ký
			if (register) {
				if (username == password){
					captcha(client, 'signUp');
					callback({title: 'ĐĂNG KÝ', text: 'Mật khẩu không được trùng với tài khoản !!'}, false);
					return void 0;;
				}else if (void 0 == data.captcha || void 0 == client.captcha.signUp) {
					captcha(client, 'signUp');
					callback({title: 'ĐĂNG KÝ', text: 'Captcha không tồn tại.'}, false);
					return void 0;;
				}else{
					var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
					checkCaptcha     = checkCaptcha.test(client.captcha.signUp);
					if (checkCaptcha) {
						User.findOne({'local.username': {$regex: regex}}).exec(async function(err, check){
							if (!!check){
								captcha(client, 'signUp');
								callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
								return void 0;
							}else{
								var user = await User.create({'local.username':username, 'local.password':helpers.generateHash(password), 'local.regDate': new Date()});
								if (!!user){
									client.UID = user._id;
									callback(false, true);
									return void 0;
								}else{
									captcha(client, 'signUp');
									callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
									return void 0;
								}
							}
						});
					}else{
						captcha(client, 'signUp');
						callback({title: 'ĐĂNG KÝ', text: 'Captcha không đúng.'}, false);
						return void 0;
					}
				}
			} else {
			// Đăng Nhập
				var user = await User.findOne({'local.username': {$regex: regex}});
				if (user){
					if (user.validPassword(password)){
						client.UID = user._id;
						callback(false, true);
						return void 0;
					}else{
						callback({title: 'ĐĂNG NHẬP', text: 'Sai mật khẩu!!'}, false);
						return void 0;
					}
				}else{
					callback({title: 'ĐĂNG NHẬP', text: 'Tài khoản không tồn tại!!'}, false);
					return void 0;
				}
			}
		} catch (error) {
			callback({title: 'THÔNG BÁO', text: 'Có lỗi sảy ra, vui lòng kiểm tra lại!!'});
		}
	}
};

module.exports = function(ws, redT){
	ws.auth = false;
	ws.UID  = null;
	ws.captcha = {};
	ws.on('message', function(message) {
		console.log("socketUser", message);
		try {
			message = JSON.parse(message);
			if (void 0 !== message.captcha) {
				captcha(this, message.captcha);
			}
			if (this.auth == false && void 0 !== message.authentication) {
				authenticate(this, message.authentication, function(err, success) {
					if (success) {
						ws.auth = true;
						ws.redT = redT;
						if (void 0 !== ws.redT.users[ws.UID]) {
							ws.redT.users[ws.UID].push(ws);
						}else{
							ws.redT.users[ws.UID] = [];
							ws.redT.users[ws.UID].push(ws);
						}
						socket.auth(ws);
					} else if (!!err) {
						var data = JSON.stringify({unauth: err});
						ws.send(data);
					} else {
						ws.send(JSON.stringify({unauth: {message: 'Authentication failure'}}));
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
			if (void 0 !== this.redT.users[this.UID]) {
				if (this.redT.users[this.UID].length == 1) {
					delete this.redT.users[this.UID];
					console.log('is Delete Path');
				}else{
					var self = this;
					Promise.all(this.redT.users[this.UID].map(function(obj, index){
						if (obj === self) {
							console.log('is Delete');
							self.redT.users[self.UID].splice(index, 1);
						}
					}));
				}
			}
		}
		this.auth = false;
	});
}
