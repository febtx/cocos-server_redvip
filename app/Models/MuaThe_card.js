
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MuaThe_cardSchema = new Schema({
	cart:    {type: String, required: true}, // ID giỏ hàng
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: String, required: true}, // Mệnh giá
	maThe:   {type: String, default:  ""},   // Mã Thẻ
	seri:    {type: String, default:  ""},   // Seri
	time:    {type: String, default:  ""},   // Thời gian đến
});

module.exports = mongoose.model("MuaThe_card", MuaThe_cardSchema);
