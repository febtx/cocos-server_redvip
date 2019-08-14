
const HU = require('../../../../Models/HU');

module.exports = function(client) {
	HU.find({game: "mini3cay", red:true}, 'name type', function(err, cat){
		var data = {};
		Promise.all(cat.map(function(obj){
			if (obj.type == 100) {
				data.hu100 = {name: obj.name};
			}else if (obj.type == 1000) {
				data.hu1k  = {name: obj.name};
			}else{
				data.hu10k = {name: obj.name};
			}
			return void 0;
		}))
		.then(varT => {
			client.red({mini3cay:data});
		})
	});
}
