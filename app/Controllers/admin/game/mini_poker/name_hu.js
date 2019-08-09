
const UserInfo    = require('../../../../Models/UserInfo');
const miniPokerHu = require('../../../../Models/miniPoker/miniPokerHu');

module.exports = function(client, data) {
	var name = data.name;
	var bet  = data.bet;

	var regex = new RegExp("^" + name + "$", 'i');
	UserInfo.findOne({name: {$regex: regex}}, 'name', function(err, data){
		if (!!data) {
			miniPokerHu.findOneAndUpdate({type:bet, red:true}, {$set:{name:data.name}}, function(err,cat){});
			client.red({mini_poker:{name_hu:{bet: bet, name: data.name}}, notice:{title:'MINI POKER',text:'Hũ ' + bet + ' sẽ được kích nổ bởi ' + data.name + '...'}});
		}else{
			client.red({notice:{title:'THẤT BẠI',text:'Người dùng không tồn tại...'}});
		}
	})
}