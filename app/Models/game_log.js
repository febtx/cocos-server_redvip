
let mongoose = require("mongoose");

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, index: true},    // ID Người chơi
	title:  {type: String},                                 // Dịch vụ
	bet:    {type: mongoose.Schema.Types.Long, default: 0}, // Tiền thắng/thua
	balans: {type: mongoose.Schema.Types.Long, default: 0}, // Số dư
	info:   {type: String},                                 // Chi tiết
	type:   {type: Boolean, default: false},                // -/+
	time:   {type: Date},                                   // thời gian
});

module.exports = mongoose.model("game_log", Schema);
