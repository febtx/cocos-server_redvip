
const mongoose      = require('mongoose');

//const uniqueValidator = require("mongoose-unique-validator");
//const mongooseHidden = require('mongoose-hidden')();
const bcrypt = require("bcrypt-nodejs");

const Schema = new mongoose.Schema({
	local: {
		username:   { type: String, required: true, unique: true },
		password:   { type: String, required: true, hide: true },
		token:      String,
		lastDate:   String,
		lastLogin:  String,
		regDate:    Date,
	},
	facebook: {
		id:         String,
		token:      String,
		email:      String,
		name:       String,
		regDate:    Date,
	},
	twitter: {
		id:          String,
		token:       String,
		email:       String,
		name:        String,
		regDate:     Date,
	},
	google: {
		id:         String,
		token:      String,
		email:      String,
		name:       String,
		regDate:    Date,
	},
});

//Schema.plugin(uniqueValidator);
//Schema.plugin(mongooseHidden, {hidden: {'_id': false, 'local.password': true}});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
Schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// kiểm tra mật khẩu có trùng khớp
Schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);

};
const Users = mongoose.model("Users", Schema);
module.exports = Users;
