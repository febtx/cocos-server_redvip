
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID Người chơi

	hu:     {type: Number, default: 0},     // Số lần Nổ Hũ REd
	bet:    {type: Number, default: 0},     // Số tiền đã chơi
	win:    {type: Number, default: 0},     // Số tền đã thắng
	lost:   {type: Number, default: 0},     // Số Red đã thua

	huXu:   {type: Number, default: 0},     // Số lần Nổ Hũ Xu
	betXu:  {type: Number, default: 0},     // Số Xu đã chơi
	winXu:  {type: Number, default: 0},     // Số Xu đã thắng
	lostXu: {type: Number, default: 0},     // Số Xu đã thua
	thuong: {type: Number, default: 0},     // Số Red Thưởng
});

module.exports = mongoose.model("BigBabol_users", Schema);
