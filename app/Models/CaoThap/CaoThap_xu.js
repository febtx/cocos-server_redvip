
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	uid:  {type: String,  required: true},      // ID Người chơi
	goc:  {type: Number,  default: 0},          // Tiền gốc (mức cược gốc)
	play: {type: Boolean, default: false},      // Phiên đang chơi
	cuoc: {type: Number,  default: 0},          // Tiền cược
	bet:  {type: Number,  default: 0},          // Tiền thắng
	buoc: {type: Number,  default: 0},          // Số bước đã chơi
	card: {},                                   // Kết quả cuối cùng
	a:    [],
	time: {type: Date,    default: new Date()}, // Thời gian cuối cùng
});

Schema.plugin(AutoIncrement.plugin, {modelName:'CaoThap_xu', field:'id'});

module.exports = mongoose.model("CaoThap_xu", Schema);
