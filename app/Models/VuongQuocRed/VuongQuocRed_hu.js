
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	name: {type: String, default: ''},     // Tên người được nổ hũ
	type: {type: Number, required:  true}, // Loại hũ {100, 1.000, 10.000}
	red:  {type: Boolean, required: true}, // Red || Xu
	bet:  {type: Number, default: 0},      // Giá trị Hũ
	min:  {type: Number, default: 0},      // Sau khi nổ hũ, sẽ quay về số giá trị nhỏ nhất của hũ
});

module.exports = mongoose.model("VuongQuocRed_hu", Schema);
