
const VuongQuocRed_red = require('../../../Models/VuongQuocRed/VuongQuocRed_red');
const VuongQuocRed_xu  = require('../../../Models/VuongQuocRed/VuongQuocRed_xu');

const UserInfo  = require('../../../Models/UserInfo');
const Helpers   = require('../../../Helpers/Helpers');

function onSelectBox(client, box){
	if (void 0 !== client.VuongQuocRed &&
		client.VuongQuocRed.bonus !== null &&
		client.VuongQuocRed.bonusL > 0)
	{
		var index = box-1;
		if (!client.VuongQuocRed.bonus[index].isOpen) {
			client.VuongQuocRed.bonusL -= 1;
			client.VuongQuocRed.bonus[index].isOpen = true;

			var bet = client.VuongQuocRed.bonus[index].bet;
			client.VuongQuocRed.bonusWin += bet;
			client.send(JSON.stringify({VuongQuocRed:{bonus:{bonus: client.VuongQuocRed.bonusL, box: index, bet: bet}}}));
			if (!client.VuongQuocRed.bonusL) {
				setTimeout(function(){
					var betWin = client.VuongQuocRed.bonusWin*client.VuongQuocRed.bonusX;
					if (client.VuongQuocRed.red) {
						VuongQuocRed_red.findOneAndUpdate({'_id': client.VuongQuocRed.id}, {$inc:{win:betWin}}, function(err, small){});
					}else{
						VuongQuocRed_xu.findOneAndUpdate({'_id': client.VuongQuocRed.id}, {$inc:{win:betWin}}, function(err, small){});
					}
					client.VuongQuocRed.bonus    = null;
					client.VuongQuocRed.bonusWin = 0;
					client.VuongQuocRed.bonusX   = 0;
					UserInfo.findOneAndUpdate({id:client.UID}, client.VuongQuocRed.red ? {$inc:{red:betWin}} : {$inc:{xu:betWin}}, function(err, user){
						if (client.VuongQuocRed.red) {
							client.send(JSON.stringify({VuongQuocRed:{bonus:{win: betWin}}, user:{red:user.red+betWin}}));
						}else{
							client.send(JSON.stringify({VuongQuocRed:{bonus:{win: betWin}}, user:{xu:user.xu+betWin}}));
						}
					});
				}, 700);
			}
		}
	}
}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box)
	}
};
