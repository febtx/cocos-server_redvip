
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChuyenRedSchema = new Schema({
	from:    {type: String, required: true}, // Tên người gủi
	to:      {type: String, required: true}, // Tên người nhận
	red:     {type: Number, required: true}, // Số red gửi
	red_c:   {type: Number, required: true}, // Số red nhận được
	message: String,                         // Thông điệp
	time:    Date,                           // Thời gian gửi
});

module.exports = mongoose.model("ChuyenRed", ChuyenRedSchema);
