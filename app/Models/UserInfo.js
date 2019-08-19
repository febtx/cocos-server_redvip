
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	id:         {type: String, required: true, unique: true, index: true}, // ID đăng nhập
	name:       {type: String, unique: true,   index: true},    // Tên nhân vật
	avatar:     {type: String, default: ''},       // Tên avatar
	joinedOn:   {type: Date, default: new Date()}, // Ngày tham gia

	phone:      {type: String, default: '', index: true}, // SĐT
	email:      {type: String, default: '', index: true}, // EMail
	cmt:        {type: String, default: ''}, // CMT

	security:   {                            // Bảo Mật
		login:   {type: Number, default: 0}, // Bảo mật đăng nhập
	},

	red:        {type: mongoose.Schema.Types.Long, default: 0},     // RED
	ketSat:     {type: mongoose.Schema.Types.Long, default: 0},     // RED trong két sắt
	xu:         {type: mongoose.Schema.Types.Long, default: 0},     // XU

	redWin:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red thắng
	redLost:    {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red thua
	redPlay:    {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red đã chơi

	xuWin:      {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu thắng
	xuLost:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu thua
	xuPlay:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu đã chơi
	thuong:     {type: mongoose.Schema.Types.Long, default: 0},     // RED thưởng khi chơi XU

	vip:        {type: Number, default: 0},                         // Tổng vip tích luỹ (Vip đã đổi thưởng)
	lastVip:    {type: Number, default: 0},                         // Cập nhật lần đổi thưởng cuối

	hu:         {type: Number, default: 0},                         // Số lần Nổ Hũ REd
	huXu:       {type: Number, default: 0},                         // Số lần Nổ Hũ Xu

	type:       {type: Boolean, default: false},                    // Bot = true | Users = false
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'UserInfo', field:'UID'});

module.exports = mongoose.model("UserInfo", Schema);
