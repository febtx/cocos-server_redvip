
var BauCua_cuoc = require('../../../Models/BauCua/BauCua_cuoc');
var BauCua_temp = require('../../../Models/BauCua/BauCua_temp');

var UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client, data){
	if (!!data && !!data.cuoc) {
		var cuoc    = data.cuoc>>0;
		var red     = !!data.red;
		var linhVat = data.linhVat>>0;

		if (client.redT.BauCua_time < 2 || client.redT.BauCua_time > 60) {
			client.red({mini:{baucua:{notice: 'Vui lòng cược ở phiên sau.!!'}}});
			return;
		}

		if (cuoc < 100 || linhVat < 0 || linhVat > 5) {
			client.red({mini:{baucua:{notice: "Cược thất bại..."}}});
		}else{
			UserInfo.findOne({id: client.UID}, 'red xu', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({mini:{baucua:{notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để cược.!!'}}});
				}else{
					var dataXu = [
						"meXuHuou",
						"meXuBau",
						"meXuGa",
						"meXuCa",
						"meXuCua",
						"meXuTom",
					]
					var dataRed = [
						"meRedHuou",
						"meRedBau",
						"meRedGa",
						"meRedCa",
						"meRedCua",
						"meRedTom",
					]
					var tab = red ? dataRed : dataXu;
					var data = {};
					UserInfo.findOneAndUpdate({id:client.UID}, red ? {$inc:{red:-cuoc}} : {$inc:{xu:-cuoc}}, function(err, cat){});
					BauCua_cuoc.findOne({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, function(err, checkOne) {
						if (checkOne){
							var update = {};
							update[linhVat] = cuoc;
							BauCua_cuoc.findOneAndUpdate({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, {$inc:update}, function (err, cat){
								Promise.all(tab.map(function(o, i){
									data[o] = cat[i] + (i == linhVat ? cuoc : 0);
									return (data[o] = cat[i] + (i == linhVat ? cuoc : 0));
								}))
								.then(result => {
									var dataT = {mini:{baucua:{data: data}}, user:red ? {red: user.red-cuoc, xu:user.xu} : {red: user.red, xu:user.xu-cuoc}};
									Promise.all(client.redT.users[client.UID].map(function(obj){
										obj.red(dataT);
									}));
								})
							});
						}else{
							var create = {uid: client.UID, name: client.profile.name, phien: client.redT.BauCua_phien, red:red, time: new Date()};
							create[linhVat] = cuoc;
							BauCua_cuoc.create(create);
							data[tab[linhVat]] = cuoc;
							var dataT = {mini:{baucua:{data: data}}, user:red ? {red: user.red-cuoc, xu:user.xu} : {red: user.red, xu:user.xu-cuoc}};
							Promise.all(client.redT.users[client.UID].map(function(obj){
								obj.red(dataT);
							}));
						}
					})
					BauCua_temp.findOne({}, '_id', function(err, temp) {
						var map = (red ? 'red' : 'xu') + '.' + linhVat;
						var update = {};
						update[map] = cuoc;
						BauCua_temp.findOneAndUpdate({'_id': temp._id}, {$inc:update}, function (err, cat){});
					})
				}
			});
		}
	}
};
