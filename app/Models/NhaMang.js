
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NhaMangSchema = new Schema({
	name: {type: String,  required: true}, // Tên nhà mạng
	nap:  {type: Boolean, default: false}, // Áp dụng cho nạp Red
	mua:  {type: Boolean, default: false}, // Áp dụng cho mua thẻ nạp
});

module.exports = mongoose.model("NhaMang", NhaMangSchema);
