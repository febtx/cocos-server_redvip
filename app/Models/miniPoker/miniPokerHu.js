
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mPokerSchema = new Schema({
	name: {type: String, default: ''},
	type: {type: Number, required: true},
	red:  {type: Boolean, required: true},
	bet:  {type: Number, default: 0},
	min:  {type: Number, default: 0},
});

const mPoker = mongoose.model("mPokerHu", mPokerSchema);
module.exports = mPoker;
