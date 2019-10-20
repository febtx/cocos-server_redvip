
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID Người chơi

	hu:     {type: Number, default: 0},                   // Số lần Nổ Hũ
	spin:   {type: Number, default: 0},                   // Số lần đã quay
	win:    {type: Number, default: 0},                   // Số tiền đã thắng

	100:    {type: Number, default: 0},                   // Lượt quay phòng 100
	1000:   {type: Number, default: 0},                   // Lượt quay phòng 1000
	10000:  {type: Number, default: 0},                   // Lượt quay phòng 10000
});

module.exports = mongoose.model('MegaJP_user', Schema);
