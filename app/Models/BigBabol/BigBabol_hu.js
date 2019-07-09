
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	name: {type: String, default: ''},
	type: {type: Number, required:  true},
	red:  {type: Boolean, required: true},
	bet:  {type: Number, default: 0},
	min:  {type: Number, default: 0},
});

module.exports = mongoose.model("BigBabol_hu", Schema);
