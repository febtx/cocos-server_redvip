
var validator = require('validator');
var User      = require('./app/Models/Users');
var helpers   = require('./app/Helpers/Helpers');
var socket    = require('./app/socket.js');
var captcha   = require('./captcha');
var forgotpass = require('./app/Controllers/user/for_got_pass');

// Authenticate!
var authenticate = async function(client, data, callback) {
	if (!!data && !!data.username && !!data.password) {
		var username = data.username;
		var password = data.password;
		var register = !!data.register;
		var az09     = new RegExp("^[a-zA-Z0-9]+$");
		var testName = az09.test(username);

		if (validator.isLength(username, {min: 3, max: 32})) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tài khoản (3-32 kí tự).'}, false);
		}else if (validator.isLength(password, {min: 6, max: 32})) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Mật khẩu (6-32 kí tự)'}, false);
		}else if (!testName) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tên đăng nhập chỉ gồm kí tự và số !!'}, false);
		}else if (username == password) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tài khoản không được trùng với mật khẩu!!'}, false);
		}else{
			try {
				var regex = new RegExp("^" + username + "$", 'i');
				// Đăng Ký
				if (register) {
					if (!data.captcha || !client.c_captcha || !validator.isLength(data.captcha, {min: 4, max: 4})) {
						client.c_captcha('signUp');
						callback({title: 'ĐĂNG KÝ', text: 'Captcha không tồn tại.'}, false);	
					}else{
						var checkCaptcha = new RegExp("^" + data.captcha + "$", 'i');
						checkCaptcha     = checkCaptcha.test(client.captcha);
						if (checkCaptcha) {
							User.findOne({'local.username': {$regex: regex}}).exec(async function(err, check){
								if (!!check){
									client.c_captcha('signUp');
									callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
								}else{
									var user = await User.create({'local.username':username, 'local.password':helpers.generateHash(password), 'local.regDate': new Date()});
									if (!!user){
										client.UID = user._id.toString();
										callback(false, true);
									}else{
										client.c_captcha('signUp');
										callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
									}
								}
							});
						}else{
							client.c_captcha('signUp');
							callback({title: 'ĐĂNG KÝ', text: 'Captcha không đúng.'}, false);
						}
					}
				} else {
				// Đăng Nhập
					var user = await User.findOne({'local.username': {$regex: regex}});
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
				}
			} catch (error) {
				callback({title: 'THÔNG BÁO', text: 'Có lỗi sảy ra, vui lòng kiểm tra lại!!'}, false);
			}
		}
	}
};

module.exports = function(ws, redT){
	ws.auth      = false;
	ws.UID       = null;
	ws.captcha   = {};
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
			if (!!message) {
				message = JSON.parse(message);
				if (!!message.captcha) {
					this.c_captcha(message.captcha);
				}
				if (!!message.forgotpass) {
					forgotpass(this, message.forgotpass);
				}
				if (this.auth == false && !!message.authentication) {
					authenticate(this, message.authentication, function(err, success){
						if (success) {
							this.auth = true;
							this.redT = redT;
							socket.auth(this);
						} else if (!!err) {
							this.red({unauth: err});
						} else {
							this.red({unauth: {message: 'Authentication failure'}});
						}
					}.bind(this));
				}else if(!!this.auth){
					socket.message(this, message);
				}
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
