/**
 * Mail Controller
 */

var path   = require('path');
var config = require("../config/email");  // config email
var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");

function sendOTP(email, otp){
	ejs.renderFile(path.dirname(__dirname) + "/templates/emails/otp.ejs", {otp: otp}, function(err, data){
		if (err) {
		} else {
			var transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
				user: config.user,
				pass: config.pass
			  }
			});
		    var mainOptions = {
		        from: 'Vip Red',
		        to: email,
		        subject: 'OTP ' + otp + ' - RedVip.club',
		        html: data
		    };
		    transporter.sendMail(mainOptions, function (err, info) {
		    });
		}
	});
}

module.exports = {
	sendOTP: sendOTP,
}