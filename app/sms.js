
/**
 * SMS Controller
 */

let request = require('request');
let config  = require("../config/sms");
let sendOTP = function(phone, otp){
	let qs = {
		Phone:     phone,
		Content:   'R-%20' + otp,
		ApiKey:    config.API_KEY,
		SecretKey: config.SECRET_KEY,
		SmsType:   8,
		//Brandname: config.Brandname,
	};
	request.get({
		url: config.URL,
		qs: qs,
	});
	//function(err, httpResponse, body){});
}

module.exports = {
	sendOTP: sendOTP,
}
