
const BigBabol_hu = require('../../../../Models/BigBabol/BigBabol_hu');

module.exports = function(client) {
	BigBabol_hu.find({red:true}, 'name type', function(err, cat){
		var data = {big_babol: {}};
		Promise.all(cat.map(function(obj){
			if (obj.type == 100) {
				data.big_babol.hu100 = {name: obj.name};
			}else if (obj.type == 1000) {
				data.big_babol.hu1k  = {name: obj.name};
			}else{
				data.big_babol.hu10k = {name: obj.name};
			}
			return void 0;
		}))
		.then(varT => {
			client.send(JSON.stringify(data));
		})
	});
}
