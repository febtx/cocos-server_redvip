
/**
 * SMS Controller
 */

const request = require('request');
const config  = require("../config/sms");

function sendOTP(phone, otp){
	var qs = {
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
