
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

//MongooseAutoIncrementID.initialise('UserInfo');

const Schema = new mongoose.Schema({
	uid:   {type: String, required: true},
	name:  {type: String, required: true},
	value: {type: String, required: true},
	type:  {type: Number},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'TaiXiu_chat', field:'id'});

const TaiXiu_chat = mongoose.model("TaiXiu_chat", Schema);
module.exports = TaiXiu_chat;
