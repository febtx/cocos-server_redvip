
let mongoose = require("mongoose");

let Schema = new mongoose.Schema({
	uid:    {type: String,  required: true},
	code:   {type: String,  required: true},
	active: {type: Boolean, default: false},
    date:   {type: Date,    required: true},
});

module.exports = mongoose.model("OTP", Schema);
