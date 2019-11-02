
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true}, // ID Người chơi
	red:     {type: Number, required: true}, // Red nạp
	xu:      {type: Number, required: true}, // Xu nhận được
	time:    Date,                           // Thời gian mua
});

module.exports = mongoose.model('MuaXu', Schema);
