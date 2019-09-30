
/**
 * SMS Controller
 */

let request = require('request');
let config  = require('../config/sms');

let sendOTP = function(phone, otp){
	let form = {
		  'source': 'Verify',
		  'destination': phone,
		  'text': config.Brandname + ': Ma OTP cua ban la ' + otp,
		  'encoding': 'GSM7',
	};
	request.post({
		url: config.URL,
		headers: {'Authorization':'Bearer ' + config.Author, 'Content-Type': 'application/json'},
		json: form,
	});
}

module.exports = {
	sendOTP: sendOTP,
}
