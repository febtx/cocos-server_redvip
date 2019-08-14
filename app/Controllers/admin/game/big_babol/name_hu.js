
const UserInfo = require('../../../../Models/UserInfo');
const HU       = require('../../../../Models/HU');

module.exports = function(client, data) {
	if (!!data && !!data.name && !!data.bet) {
		var name = data.name;
		var bet  = data.bet;

		var regex = new RegExp("^" + name + "$", 'i');
		UserInfo.findOne({name: {$regex: regex}}, 'name', function(err, data){
			if (!!data) {
				HU.findOneAndUpdate({game: "bigbabol", type:bet, red:true}, {$set:{name:data.name}}, function(err,cat){});
				client.red({big_babol:{name_hu:{bet: bet, name: data.name}}, notice:{title:'BIG BABOL',text:'Hũ ' + bet + ' sẽ được kích nổ bởi ' + data.name + '...'}});
			}else{
				client.red({notice:{title:'THẤT BẠI',text:'Người dùng không tồn tại...'}});
			}
		})
	}
}
