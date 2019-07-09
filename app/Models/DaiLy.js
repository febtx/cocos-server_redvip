
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DaiLySchema = new Schema({
	name:     {type: String, required: true}, // Tên đại lý
	nickname: {type: String, required: true}, // Tên nhân vật trong game
	phone:    {type: String, required: true}, // Số điện thoại
	fb:       {type: String, default:  ""},   // ID Facabook
});

module.exports = mongoose.model("DaiLy", DaiLySchema);
