
let mongoose = require("mongoose");

let Schema = new mongoose.Schema({
	date:   {type: String,  required: true, index: true}, // ngày sự kiện
	name:   {type: String,  required: true},              // Tên tài khoản
	line:   {type: Number,  required: true},              // Số dây Thắng/Thua
	win:    {type: Boolean, default: false},              // Thắng/Thua
	first:  {type: Number,  default: 0},                  // Phiên đầu tiên
	last:   {type: Number,  default: 0},                  // Phiên cuối cùng
	reward: {type: Number,  default: 0},                  // Phần thưởng
});

module.exports = mongoose.model("TaiXiu_event", Schema);
