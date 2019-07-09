
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MuaXuSchema = new Schema({
	uid:     {type: String, required: true}, // ID Người chơi
	red:     {type: Number, required: true}, // Red nạp
	xu:      {type: Number, required: true}, // Xu nhận được
	time:    Date,                           // Thời gian mua
});

module.exports = mongoose.model("MuaXu", MuaXuSchema);
