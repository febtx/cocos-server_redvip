
var napthe = require('./Remove/napthe');
var rutthe = require('./Remove/rutthe');


module.exports = function (client, data) {
	if (!!data.napthe) {
		napthe(client, data.napthe)
	}
	if (!!data.rutthe) {
		rutthe(client, data.rutthe)
	}
}
