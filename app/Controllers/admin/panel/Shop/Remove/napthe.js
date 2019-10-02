
var NapThe = require('../../../../../Models/NapThe');

module.exports = function (client, data) {
	NapThe.deleteOne({'_id':data}, function(err, remove){
		if (remove.n > 0) {
			client.red({banklist:{remove:true}, nap_the:{remove:true}, notice:{title:'THÀNH CÔNG', text:'XÓA thành công...'}});
		}else{
			client.red({banklist:{remove:true}, notice:{title:'LỖI', text:'Thẻ không tồn tại...'}});
		}
	});
}
