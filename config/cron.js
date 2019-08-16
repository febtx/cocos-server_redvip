
var CronJob = require('cron').CronJob;

var CronHu  = require('../app/Cron/EventHu');

module.exports = function() {
	new CronJob('10 0 0 * * *', function() {
		CronHu();
	}, null, true, 'Asia/Ho_Chi_Minh');
}
