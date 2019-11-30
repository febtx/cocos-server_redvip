
let request      = require('request');
let crypto       = require('crypto');
let jsonwebtoken = require('jsonwebtoken');

module.exports = function(client, data){
	let id     = data.id>>0;
	let amount = data.amount>>0;
	if (!!id && amount >= 50000) {
		let tokenId = crypto.randomBytes(32).toString('hex');
		tokenId = Buffer.from(tokenId).toString('base64');
		let issuedAt = (new Date().getTime()/1000)>>0;
		let notBefore = issuedAt;
		let expire    = notBefore+60;

		let API_KEY = 'a18ff78e7a9e44f38de372e093d87ca1';
		let API_SEC = '9623ac03057e433f95d86cf4f3bef5cc';

		let form = {
			mrc_order_id:crypto.randomBytes(16).toString('hex'),
			total_amount:amount,
			description:'Test by MrT',
			url_success:'https://sandbox-api.baokim.vn',
			lang:'vi',
			bpm_id:id,
			webhooks:'https://sandbox-api.baokim.vn',
		};
		let dataBase = {
			'iat': issuedAt,  // Issued at: time when the token was generated
			'jti': tokenId,   // Json Token Id: an unique identifier for the token
			'iss': API_KEY,   // Issuer
			'nbf': notBefore, // Not before
			'exp': expire,    // Expire
			'form_params': form,
		};

		let jwt = jsonwebtoken.sign(dataBase, API_SEC, {algorithm:'HS256'});

		request.post({
			url: 'https://sandbox-api.baokim.vn/payment/api/v4/order/send?jwt='+jwt,
			form: form
		},
		function(err, httpResponse, body){
			body = JSON.parse(body);
			console.log(body);
		});
			//accept_bank:1,
			//accept_cc:1,
			//accept_qrpay:0,
			//url_detail:,
	}
}
