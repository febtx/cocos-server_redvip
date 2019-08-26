
const Message = require('../../Models/Message');

module.exports = function(client){
	Message.find({uid: client.UID}, 'title read time', {sort:{'_id':-1}}, function(err, data){
		client.red({message:{list:data}});
	});
}
