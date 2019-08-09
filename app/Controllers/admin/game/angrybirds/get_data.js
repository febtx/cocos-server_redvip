
const HU = require('../../../../Models/HU');

module.exports = function(client) {
	HU.find({game: "arb", red: true}, 'name type', function(err, cat){
		var data = {angrybied: {}};
		Promise.all(cat.map(function(obj){
			if (obj.type == 100) {
				data.angrybied.hu100 = {name: obj.name};
			}else if (obj.type == 1000) {
				data.angrybied.hu1k  = {name: obj.name};
			}else{
				data.angrybied.hu10k = {name: obj.name};
			}
			return void 0;
		}))
		.then(varT => {
			client.red(data);
		})
	});
}
