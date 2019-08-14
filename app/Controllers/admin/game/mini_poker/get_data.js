
const HU = require('../../../../Models/HU');

module.exports = function(client) {
	HU.find({game: "minipoker", red:true}, 'name type', function(err, cat){
		var data = {mini_poker: {}};
		Promise.all(cat.map(function(obj){
			if (obj.type == 100) {
				data.mini_poker.hu100 = {name: obj.name};
			}else if (obj.type == 1000) {
				data.mini_poker.hu1k = {name: obj.name};
			}else{
				data.mini_poker.hu10k = {name: obj.name};
			}
			return void 0;
		}))
		.then(varT => {
			client.red(data);
		})
	});
}
