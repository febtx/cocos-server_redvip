
const MuaXu    = require('../../Models/MuaXu');
const UserInfo = require('../../Models/UserInfo');

module.exports = function(client, data){
	var red = data.red>>0;

	if (red < 100) {
		client.send(JSON.stringify({notice:{title:'MUA XU', text:'Tối thiểu 100 RED.!!'}}));
	}else{
		UserInfo.findOne({id: client.UID}, 'red name', async function(err, check){
			if (check === null || (check.red < red)) {
				client.send(JSON.stringify({notice:{title:'MUA XU',text:'Số dư không khả dụng.!!'}}));
			}else{
				var xu = red*3;
				UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:-red, xu:xu}}, function(err, user){
					client.send(JSON.stringify({notice:{title:'MUA XU',text:'Mua Xu thành công...'}, user:{red: user.red-red, xu: user.xu+xu}}));
				});
				MuaXu.create({'uid':client.UID, 'red':red, 'xu':xu, 'time': new Date()});
			}
		});
	}
}
