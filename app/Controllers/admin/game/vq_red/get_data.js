
var HU     = require('../../../../Models/HU');
var config = require('../../../../../config/vqred.json');

module.exports = function(client) {
	HU.find({game: "vuongquocred", red:true}, 'name type', function(err, cat){
		var data = {vq_red: {chedo: config.chedo}};
		Promise.all(cat.map(function(obj){
			if (obj.type == 100) {
				data.vq_red.hu100 = {name: obj.name};
			}else if (obj.type == 1000) {
				data.vq_red.hu1k  = {name: obj.name};
			}else{
				data.vq_red.hu10k = {name: obj.name};
			}
			return void 0;
		}))
		.then(varT => {
			client.red(data);
		})
	});
}
