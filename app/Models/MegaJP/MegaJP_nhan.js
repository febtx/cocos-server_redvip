
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, index: true}, // ID người chơi
	room:   {type: Number, default: 0},                  // Phòng 100/1000/10000
	to:     {type: Number, default: 0},                  // Nguồn
	sl:     {type: Number, default: 0},                  // Số lượng
	status: {type: Number, default: 0},                  // Trạng thái nhận
	time:   {type: Date,   default: new Date()},
});

module.exports = mongoose.model('MegaJP_nhan', Schema);
