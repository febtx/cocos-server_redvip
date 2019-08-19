
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	uid:  {type: String, required: true}, // ID Người chơi
	bet:  {type: Number, default: 0},     // Mức cược
	win:  {type: Number, default: 0},     // Tiền thắng
	type: {type: Number, default: 0},     // Loại được ăn lớn nhất trong phiên
	kq:   [],
	time: {type: Date,   default: new Date()},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'Mini3Cay_red', field:'id'});
Schema.index({uid: 1}, {background: true});

module.exports = mongoose.model("Mini3Cay_red", Schema);
