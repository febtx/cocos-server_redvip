
var VuongQuocRed_red   = require('../../../Models/VuongQuocRed/VuongQuocRed_red');
var VuongQuocRed_xu    = require('../../../Models/VuongQuocRed/VuongQuocRed_xu');
var VuongQuocRed_users = require('../../../Models/VuongQuocRed/VuongQuocRed_users');

var UserInfo = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.VuongQuocRed &&
		client.VuongQuocRed.bonus !== null &&
		client.VuongQuocRed.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.VuongQuocRed.bonus[index]) {
			if (!client.VuongQuocRed.bonus[index].isOpen) {
				client.VuongQuocRed.bonusL -= 1;
				client.VuongQuocRed.bonus[index].isOpen = true;

				var bet = client.VuongQuocRed.bonus[index].bet;
				client.VuongQuocRed.bonusWin += bet;
				client.red({VuongQuocRed:{bonus:{bonus: client.VuongQuocRed.bonusL, box: index, bet: bet}}});
				if (!client.VuongQuocRed.bonusL) {
					setTimeout(function(){
						var betWin = client.VuongQuocRed.bonusWin*client.VuongQuocRed.bonusX;

						var uInfo = {};
						var gInfo = {};

						if (client.VuongQuocRed.red) {
							uInfo['red']    = betWin;
							uInfo['redWin'] = gInfo['win'] = betWin; // Cập nhật Số Red đã Thắng
							VuongQuocRed_red.findOneAndUpdate({'_id': client.VuongQuocRed.id}, {$inc:{win:betWin}}, function(err, small){});
						}else{
							uInfo['xu']    = betWin;
							uInfo['xuWin'] = gInfo['winXu'] = betWin; // Cập nhật Số xu đã Thắng
							thuong         = (betWin*0.039589)>>0;
							uInfo['red']   = uInfo['thuong'] = gInfo['thuong'] = thuong;
							VuongQuocRed_xu.findOneAndUpdate({'_id': client.VuongQuocRed.id}, {$inc:{win:betWin}}, function(err, small){});
						}

						client.VuongQuocRed.bonus    = null;
						client.VuongQuocRed.bonusWin = 0;
						client.VuongQuocRed.bonusX   = 0;

						UserInfo.findOneAndUpdate({id:client.UID}, 'red xu', {$inc: uInfo}, function(err, user){
							if (client.VuongQuocRed.red) {
								client.red({VuongQuocRed:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							}else{
								client.red({VuongQuocRed:{bonus:{win: betWin}}, user:{xu:user.xu*1+betWin}});
							}
						});

						VuongQuocRed_users.findOneAndUpdate({'uid':client.UID}, {$inc:gInfo}, function(err,cat){});

					}, 700);
				}
			}
		}
	}
}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
