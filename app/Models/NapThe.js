
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require("mongoose");

const Schema = new mongoose.Schema({
	uid:     {type: String, required: true}, // ID người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: Number, required: true}, // Mệnh giá
	nhan:    {type: Number, default: 0},     // Nhận
	maThe:   {type: Number, required: true}, // Mã Thẻ
	seri:    {type: Number, required: true}, // Seri
	status:  {type: Number, default: 0},     // Trạng thái nạp (0: chờ, 1: Thành công, 2:Thất bại)
	time:    Date,                           // Thời gian nạp
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'NapThe', field:'GD'});

module.exports = mongoose.model("NapThe", Schema);
