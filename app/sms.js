
/**
 * SMS Controller
 */

let request = require('request');
let config  = require("../config/sms");
let sendOTP = function(phone, otp){
	console.log(phone);
	let form = {
		  'source': 'Verify',
		  'destination': phone,
		  'text': 'Bem68: Ma OTP cua ban la ' + otp,
		  'encoding': 'GSM7',
	};
	request.post({
		url: config.URL,
		headers: {'Authorization':'Bearer 6PlFs3sAeHs3gdPcqR8PKG3prgbDb0xd5VFZ0r0', 'Content-Type': 'application/json'},
		json: form,
	});
}

module.exports = {
	sendOTP: sendOTP,
}
