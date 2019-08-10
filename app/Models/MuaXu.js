
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require("mongoose");

const Schema = new mongoose.Schema({
	uid:     {type: String, required: true}, // ID Người chơi
	red:     {type: Number, required: true}, // Red nạp
	xu:      {type: Number, required: true}, // Xu nhận được
	time:    Date,                           // Thời gian mua
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'MuaXu', field:'id'});

module.exports = mongoose.model("MuaXu", Schema);
