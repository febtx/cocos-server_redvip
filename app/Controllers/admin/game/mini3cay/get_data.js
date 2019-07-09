
const Mini3Cay_hu = require('../../../../Models/Mini3Cay/Mini3Cay_hu');

module.exports = function(client) {
	Mini3Cay_hu.find({red:true}, 'name type', function(err, cat){
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
			client.send(JSON.stringify({mini3cay:data}));
		})
	});
}
