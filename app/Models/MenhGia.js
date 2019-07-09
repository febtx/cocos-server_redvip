
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenhGiaSchema = new Schema({
	name:   {type: String,  required: true}, // mệnh giá
	values: {type: Number,  required: true}, // giá trị Red
	nap:    {type: Boolean, default: false}, // Áp dụng cho nạp Red
	mua:    {type: Boolean, default: false}, // Áp dụng cho mua thẻ nạp
});

module.exports = mongoose.model("MenhGia", MenhGiaSchema);
