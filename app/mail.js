/**
 * Mail Controller
 */

let path       = require('path');
let config     = require("../config/email");  // config email
let fs         = require("fs");
let nodemailer = require("nodemailer");
let ejs        = require("ejs");

let sendOTP    = function(email, otp){
	ejs.renderFile(path.dirname(__dirname) + "/templates/emails/otp.ejs", {otp: otp}, function(err, data){
		if (err) {
		} else {
			try {
				let transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
					user: config.user,
					pass: config.pass
				  }
				});
			    let mainOptions = {
			        from: 'RedVip',
			        to: email,
			        subject: 'OTP ' + otp + ' - RedVip.club',
			        html: data
			    };
			    transporter.sendMail(mainOptions, function (err, info) {
			    });
			} catch (errX){
				//
			}
		}
	});
}

module.exports = {
	sendOTP: sendOTP,
}
