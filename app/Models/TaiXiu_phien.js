
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	dice1: {type: Number},
	dice2: {type: Number},
	dice3: {type: Number},
	time:  {type: Date, default: new Date()},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'TaiXiu_phien', field:'id'});

module.exports = mongoose.model("TaiXiu_phien", Schema);
