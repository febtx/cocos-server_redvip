
const User    = require('./app/Models/Users');
const helpers = require('./app/Helpers/Helpers');
const socket  = require('./app/socket.js');
const captcha = require('./captcha');

const forgotpass = require('./app/Controllers/user/for_got_pass');

// Authenticate!
const authenticate = async function(client, data, callback) {
	var { username, password, register} = data;
	username = username.trim();
	password = password.trim();
	if (username.length > 32 || username.length < 3 || password.length > 32 || password.length < 6){
		client.c_captcha('signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Thông tin Sai! (6-32 kí tự)'}, false);
	}else if (username.match(new RegExp("^[a-zA-Z0-9]+$")) === null) {
		client.c_captcha('signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Tên chỉ gồm kí tự và số !!'}, false);
	}else if (username == password) {
		client.c_captcha('signUp');
		callback({title: 'ĐĂNG KÝ', text: 'Tài khoản không được trùng với mật khẩu!!'}, false);
	}else{
		try {
			var regex = new RegExp("^" + username + "$", 'i');
			// Đăng Ký
			if (register) {
				if (username == password){
					client.c_captcha('signUp');
					callback({title: 'ĐĂNG KÝ', text: 'Mật khẩu không được trùng với tài khoản !!'}, false);
					return void 0;;
				}else if (void 0 == data.captcha || void 0 == client.c_captcha) {
					client.c_captcha('signUp');
					callback({title: 'ĐĂNG KÝ', text: 'Captcha không tồn tại.'}, false);
					return void 0;;
				}else{
					var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
					checkCaptcha     = checkCaptcha.test(client.captcha);
					if (checkCaptcha) {
						User.findOne({'local.username': {$regex: regex}}).exec(async function(err, check){
							if (!!check){
								client.c_captcha('signUp');
								callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
								return void 0;
							}else{
								var user = await User.create({'local.username':username, 'local.password':helpers.generateHash(password), 'local.regDate': new Date()});
								if (!!user){
									client.UID = user._id;
									callback(false, true);
									return void 0;
								}else{
									client.c_captcha('signUp');
									callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
									return void 0;
								}
							}
						});
					}else{
						client.c_captcha('signUp');
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
	ws.c_captcha = captcha;
	ws.red = function(data){
		try {
			this.readyState == 1 && this.send(JSON.stringify(data));
		} catch(err) {}
	}
	socket.signMethod(ws);
	ws.on('message', function(message) {
		console.log("socketUser", message);
		try {
			message = JSON.parse(message);

			if (void 0 !== message.captcha) {
				this.c_captcha(message.captcha);
			}

			if (void 0 !== message.forgotpass) {
				forgotpass(this, message.forgotpass);
			}

			if (this.auth == false && void 0 !== message.authentication) {
				authenticate(this, message.authentication, function(err, success) {
					if (success) {
						ws.auth = true;
						ws.redT = redT;
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
		}
	});

	ws.on('close', function(message) {
		if (this.UID !== null && void 0 !== this.redT.users[this.UID]) {
			if (this.redT.users[this.UID].length == 1) {
				if (this.redT.users[this.UID][0] == this) {
					delete this.redT.users[this.UID];
				}
			}else{
				var self = this;
				Promise.all(this.redT.users[this.UID].map(function(obj, index){
					if (obj === self) {
						self.redT.users[self.UID].splice(index, 1);
					}
				}));
			}
		}
		this.UID  = null;
		this.auth = false;
		void 0 !== this.TTClear && this.TTClear();
	});
}
