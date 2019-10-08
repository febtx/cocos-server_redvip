
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:   {type: String,  required: true},               // ID Người cược
	phien: {type: Number,  required: true, index: true},  // phiên cược
	red:   {type: Boolean, required: true},               // loại tiền (Red = true,   Xu = false)

	chan:      {type: Number,  default: 0},         // Số tiền đặt Chẵn
	le:        {type: Number,  default: 0},         // Số tiền đặt Lẻ
	red3:      {type: Number,  default: 0},         // Số tiền đặt 3 đỏ
	red4:      {type: Number,  default: 0},         // Số tiền đặt 4 đỏ
	white3:    {type: Number,  default: 0},         // Số tiền đặt 3 trắng
	white4:    {type: Number,  default: 0},         // Số tiền đặt 4 trắng

	thanhtoan: {type: Boolean, default: false},    // tình trạng thanh toán
	bigWin:    {type: Boolean, default: false},    // Thắng lớn
	betwin:    {type: Number,  default: 0},	       // Tiền thắng được
	time:      {type: Date},                       // thời gian cược
});

Schema.index({uid:1, red:1, thanhtoan:1}, {background: true});

module.exports = mongoose.model('BauCua_cuoc', Schema);
