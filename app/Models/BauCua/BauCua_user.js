
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	uid: {type: String, required: true, unique: true}, // ID Người chơi
	red:      {type: Number,  default: 0},             // Tổng red thắng
	red_lost: {type: Number,  default: 0},             // Tổng red thua
	xu:       {type: Number,  default: 0},             // Tổng xu thắng
	xu_lost:  {type: Number,  default: 0},             // Tổng xu thua
	thuong:   {type: Number,  default: 0},             // Thưởng Red khi chơi Xu
});

module.exports = mongoose.model("BauCua_user", Schema);
