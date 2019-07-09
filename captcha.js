
var svgCaptcha = require('svg-captcha');
var svg2img    = require('svg2img');

/**
function signUp(client){
	var captcha = svgCaptcha.create({background:'#FFFFFF', noise:0});
	svg2img(captcha.data, function(error, buffer) {
		client.captcha.signUp = captcha.text;
		client.send(JSON.stringify({captcha: {signUp: "data:image/png;base64," + buffer.toString('base64')}}));
	});
}
*/
function Create(client, name){
	var captcha = svgCaptcha.create({background:'#FFFFFF', noise:0});
	svg2img(captcha.data, function(error, buffer) {
		client.captcha[name] = captcha.text;
		var data = {};
		data[name] = "data:image/png;base64," + buffer.toString('base64');
		client.send(JSON.stringify({captcha: data}));
	});
}
module.exports = function(client, data){
	switch(data){
		case "signUp":
			Create(client, 'signUp');
			break;

		case "giftcode":
			Create(client, 'giftcode');
			break;
	}
}
