
let quay = function(page){
	page = page>>0;
	if (page > 0) {
		
	}
}

let nhanve = function(page){
	page = page>>0;
	if (page > 0) {

	}
}
module.exports = function(client, data){
	if (!!data.quay) {
		quay(data.quay);
	}
	if (!!data.nhanve) {
		nhanve(data.quay);
	}
};
