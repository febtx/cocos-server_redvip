
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true}, // ID Người chơi
	from:    {type: String, required: true}, // Tên người gửi
	to:      {type: String, required: true}, // Tên người nhận
	red:     {type: Number, required: true}, // Số red gửi
	red_c:   {type: Number, required: true}, // Số red nhận được
	message: String,                         // Thông điệp
	time:    Date,                           // Thời gian gửi
});

module.exports = mongoose.model('ChuyenRed', Schema);
