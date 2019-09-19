
let mongoose = require("mongoose");

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, index: true}, // ID Người chơi
	game:   {type: String},             // game chơi
	bet:    {type: Number, default: 0}, // phòng
	win:    {type: Number, default: 0}, // tiền thắng
	lost:   {type: Number, default: 0}, // tiền thua
	time:   {type: Date},               // thời gian
});

module.exports = mongoose.model("game_log", Schema);
