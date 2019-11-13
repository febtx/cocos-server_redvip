
let mongoose = require('mongoose');
let Schema = new mongoose.Schema({
	uid:     {type:String, required:true, index:true}, // ID người dùng
	phien:   {type:Number, default:0},                 // Số người chơi
	money:   {type:Number, default:0},                 // Tiền thắng
	timeIn:  Date,                                     // Thời gian vào
	timeOut: Date,                                     // Thời gian ra
});

module.exports = mongoose.model('BanCa_history', Schema);
