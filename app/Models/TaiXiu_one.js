
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	uid:      {type: String,  required: true},    // ID Người cược
	phien:    {type: Number,  required: true},    // phiên cược
	bet:      {type: Number,  required: true},    // số tiền cược
	red:      {type: Boolean, required: true},    // loại tiền (Red        = true, Xu       = false)
	taixiu:   {type: Boolean, required: true},    // loại game (tài xỉu    = true, chẵn nẻ  = false)
	select:   {type: Boolean, required: true},    // bên cược  (Tài = Chẵn = true, Xỉu = Lẻ = false)
	tralai:   {type: Number,  default: 0},        // Số tiền trả lại
	thuong:   {type: Number,  default: 0},        // Thưởng Red khi chơi bằng xu
	win:      {type: Boolean, default: false},	  // Thắng hoặc thua
	betwin:   {type: Number,  default: 0},	      // Tiền thắng được

	type:     {type: Boolean, default: false},    // Bot = true | Users = false
});

Schema.plugin(AutoIncrement.plugin, {modelName:'TaiXiu_one', field:'id'});

module.exports = mongoose.model("TaiXiu_one", Schema);
