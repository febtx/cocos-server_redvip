
let mongoose = require("mongoose");

let Schema = new mongoose.Schema({
	form:     {type: String,  required: true, unique: true}, // ID Telegram
	phone:    {type: String,  required: true, unique: true}, // Số điện thoại
	gift:     {type: Boolean, default: false},              // Gift code khởi nghiệp
	giftTime: {type: Date,    default: new Date()},            // Thời gian tặng(1 ngày 1 gift)
});

module.exports = mongoose.model("Telegram", Schema);
