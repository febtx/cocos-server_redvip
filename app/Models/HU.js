
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	game: {type: String,  required: true},                   // Tên game
	name: {type: String,  default: ''},                      // Tên người được gọi
	type: {type: Number,  required: true},                   // Loại hũ (100, 1000, 10000)
	red:  {type: Boolean, required: true},                   // Hũ Xu hoặc Hũ Red
	bet:  {type: Number,  default: 0},                       // Giá trị hiện tại của hũ
	min:  {type: Number,  default: 0},                       // Giá trị nhỏ nhất của hũ

	toX6: {type: Number,  default: 0},                       // Sau ... hũ đến X6 hũ
	X6:   {type: Number,  default: 0},                       // Số hũ X6 còn lại

	hu:   {type: Number,  default: 0},                       // Hũ Red đã nổ
	huXu: {type: Number,  default: 0},                       // Hũ Xu  đã nổ

	redPlay: {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red đã chơi
	redWin:  {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red thắng
	redLost: {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red thua

	xuPlay:  {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Xu đã chơi
	xuWin:   {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Xu thắng
	xuLost:  {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Xu thua
});

module.exports = mongoose.model("hu", Schema);
