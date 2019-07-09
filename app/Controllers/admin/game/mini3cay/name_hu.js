
const UserInfo    = require('../../../../Models/UserInfo');
const Mini3Cay_hu = require('../../../../Models/Mini3Cay/Mini3Cay_hu');

module.exports = function(client, data) {
	var name = data.name;
	var bet  = data.bet;

	var regex = new RegExp("^" + name + "$", 'i');
	UserInfo.findOne({name: {$regex: regex}}, 'name', function(err, data){
		if (!!data) {
			Mini3Cay_hu.findOneAndUpdate({type:bet, red:true}, {$set:{name:data.name}}, function(err,cat){});
			client.send(JSON.stringify({mini3cay:{name_hu:{bet: bet, name: data.name}}, notice:{title:'MINI 3 CÂY',text:'Hũ ' + bet + ' sẽ được kích nổ bởi ' + data.name + '...'}}));
		}else{
			client.send(JSON.stringify({notice:{title:'THẤT BẠI',text:'Người dùng không tồn tại...'}}));
		}
	})
}
