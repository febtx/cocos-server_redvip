
var BauCua_phien = require('../../../Models/BauCua/BauCua_phien');
var BauCua_cuoc  = require('../../../Models/BauCua/BauCua_cuoc');
var BauCua_temp  = require('../../../Models/BauCua/BauCua_temp');

var UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client){
	var LinhVat = {};
	var data    = {};

	var dataMeXu = [
		"meXuHuou",
		"meXuBau",
		"meXuGa",
		"meXuCa",
		"meXuCua",
		"meXuTom",
	]
	var dataMeRed = [
		"meRedHuou",
		"meRedBau",
		"meRedGa",
		"meRedCa",
		"meRedCua",
		"meRedTom",
	]
	BauCua_cuoc.find({uid: client.UID, phien: client.redT.BauCua_phien}, function(err, list) {
		var TTActive1 = Promise.all(list.map(function(cuoc){
			if (cuoc.red) {
				return Promise.all(dataMeRed.map(function(tab, i){
					return (data[tab] = cuoc[i]);
				}))
			}else{
				return Promise.all(dataMeXu.map(function(tab, i){
					return (data[tab] = cuoc[i]);
				}))
			}
		}));
		var TTActive2 = new Promise((a, b)=>{
			BauCua_temp.findOne({}, {}, function(err, temp){
				var dataXu = [
					"xuHuou",
					"xuBau",
					"xuGa",
					"xuCa",
					"xuCua",
					"xuTom",
				]
				var dataRed = [
					"redHuou",
					"redBau",
					"redGa",
					"redCa",
					"redCua",
					"redTom",
				]
				var logLV = [
					"logHuou",
					"logBau",
					"logGa",
					"logCa",
					"logCua",
					"logTom",
				]
				var active1 = Promise.all(dataXu.map(function(tab, i){
					return (data[tab] = temp.xu[i]);
				}))
				var active2 = Promise.all(dataRed.map(function(tab, i){
					return (data[tab] = temp.red[i]);
				}))
				var active3 = Promise.all(logLV.map(function(tab, i){
					return (LinhVat[i] = temp[i]);
				}))
				Promise.all([active1, active2, active3])
				.then(Results => {
					a(data)
				})
			})
		})
		var TTActive3 = new Promise((resolve, reject) => {
			BauCua_phien.find({}, {}, {sort:{'id':-1}, limit: 10}, function(err, post) {
				Promise.all(post.map(function(obj){return [obj.dice1,obj.dice2,obj.dice3]}))
				.then(function(arrayOfResults) {
					resolve(arrayOfResults)
				})
			});
		});
		Promise.all([TTActive1, TTActive2, TTActive3])
		.then(ofResults => {
			client.red({mini:{baucua:{regOpen: true, data: data, logLV: LinhVat, logs: ofResults[2]}}});
		})
	})
}
