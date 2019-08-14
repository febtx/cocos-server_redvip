
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	uid:   {type: String, required: true},
	name:  {type: String, required: true},
	value: {type: String, required: true},
	type:  {type: Number},
});

module.exports = mongoose.model("TaiXiu_chat", Schema);
