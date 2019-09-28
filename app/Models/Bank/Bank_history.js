
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true},        // ID người dùng
	bank:    {type: String, required: true},                     // Ngân hàng
	number:  {type: String},                                     // Số tài khoản
	name:    {type: String},                                     // Chủ tài khoản
	branch:  {type: String},                                     // Chi nhánh
	money:   {type: mongoose.Schema.Types.Long, required: true}, // Tiền
	type:    {type: Number, default: 0},                         // Loại hóa đơn (0:nạp, 1:rút)
	info:    {type: String},                                     // Bổ sung
	status:  {type: Number, default: 0},                         // Trạng thái nạp (0: chờ, 1: Thành công, 2:Thất bại)
	time:    Date,                                               // Thời gian tạo
});
Schema.plugin(AutoIncrement.plugin, {modelName: 'Bank_history', field:'GD'});
Schema.index({type:1, status:1}, {background: true});

module.exports = mongoose.model('Bank_history', Schema);
