
let TaiXiu_User  = require('../../../Models/TaiXiu_user');
let TaiXiu_event = require('../../../Models/TaiXiu/TaiXiu_event');

let UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client){
	let date = new Date();
	date.setDate(date.getDate()-1);

	let stringTime = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();

	var topWin  = TaiXiu_event.find({date: stringTime, win: true}, {}, {sort:{'line':-1, 'last':-1}}).exec();
	var topLost = TaiXiu_event.find({date: stringTime, win: false}, {}, {sort:{'line':-1, 'last':-1}}).exec();

	Promise.all([topWin, topLost])
	.then(result => {
		client.red({event:{taixiu:{topHQ:{win: result[0], lost: result[1]}}}});
	});
};
