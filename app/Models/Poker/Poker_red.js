
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	room:   {type: Number, required: true}, // phòng
	online: {type: Number, default: 0},     // Số người chơi
});

Schema.plugin(AutoIncrement.plugin, {modelName:'Poker_red', field:'id'});
Schema.index({room: 1}, {background: true});

module.exports = mongoose.model("Poker_red", Schema);
