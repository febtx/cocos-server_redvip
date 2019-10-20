
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	name: {type: String, required: true, index: true}, // Tên người chơi
	room: {type: Number, default: 0},                  // Phòng 100/1000/10000

	kq:   {type: Number, default: 0},                  // Kết quả
	win:  {type: Number, default: 0},                  // Tiền thắng

	time: {type: Date,   default: new Date()},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'MegaJP_spin', field:'id'});

module.exports = mongoose.model('MegaJP_spin', Schema);
