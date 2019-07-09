
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPCodeSchema = new Schema({
	uid:    {type: String, default: ''},
	code:   {type: String, default: ''},
	type:   {type: String, default: ''},
	key:    {type: String, default: ''},
	value:  {type: String, default: ''},
    date:   {type: Date,   default: new Date()},
    todate: {type: Date},
});

const OTPCode = mongoose.model("OTPCode", OTPCodeSchema);
module.exports = OTPCode;
