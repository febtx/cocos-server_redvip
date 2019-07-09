
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	name:    {type: String, required: true}, // Tên người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: Number, required: true}, // Mệnh giá
	soLuong: {type: Number, required: true}, // Số lượng
	Cost:    {type: Number, required: true}, // Chi Phí
	status:  {type: Number, default:  0},    // Trạng thái mua
	time:    Date,                           // Thời gian mua
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'MuaThe', field:'GD'});

module.exports = mongoose.model("MuaThe", Schema);
