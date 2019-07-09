
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	name: {type: String, default: ''},     // Tên người được gọi
	type: {type: Number, required: true},  // Loại hũ (100, 1000, 10000)
	red:  {type: Boolean, required: true}, // Hũ Xu hoặc Hũ Red
	bet:  {type: Number, default: 0},      // Giá trị hiện tại của hũ
	min:  {type: Number, default: 0},      // Giá trị nhỏ nhất của hũ
});

module.exports = mongoose.model("Mini3Cay_hu", Schema);
