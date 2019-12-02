
var BauCua_cuoc = require('../../../Models/BauCua/BauCua_cuoc');
var UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client, data){
	if (!!data && !!data.cuoc) {
		var cuoc    = data.cuoc>>0;
		var red     = true;
		var linhVat = data.linhVat>>0;

		if (client.redT.BauCua_time < 2 || client.redT.BauCua_time > 60) {
			client.red({mini:{baucua:{notice: 'Vui lòng cược ở phiên sau.!!'}}});
			return;
		}

		if (cuoc < 1000 || linhVat < 0 || linhVat > 5) {
			client.red({mini:{baucua:{notice: 'Cược thất bại...'}}});
		}else{
			UserInfo.findOne({id: client.UID}, 'red', function(err, user){
				if (!user || user.red < cuoc) {
					client.red({mini:{baucua:{notice: 'Bạn không đủ RED để cược.!!'}}});
				}else{
					user.red -= cuoc;
					user.save();

					var dataRed = [
						'meRedHuou',
						'meRedBau',
						'meRedGa',
						'meRedCa',
						'meRedCua',
						'meRedTom',
					]
					var data = {};
					BauCua_cuoc.findOne({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, function(err, checkOne) {
						var io = client.redT;
							if (linhVat == 0) {
								io.baucua.info.redHuou += cuoc;
								io.baucua.infoAdmin.redHuou += cuoc;
							}else if (linhVat == 1) {
								io.baucua.info.redBau += cuoc;
								io.baucua.infoAdmin.redBau += cuoc;
							}else if (linhVat == 2) {
								io.baucua.info.redGa += cuoc;
								io.baucua.infoAdmin.redGa += cuoc;
							}else if (linhVat == 3) {
								io.baucua.info.redCa += cuoc;
								io.baucua.infoAdmin.redCa += cuoc;
							}else if (linhVat == 4) {
								io.baucua.info.redCua += cuoc;
								io.baucua.infoAdmin.redCua += cuoc;
							}else if (linhVat == 5) {
								io.baucua.info.redTom += cuoc;
								io.baucua.infoAdmin.redTom += cuoc;
							}
						if (checkOne){
							let update = {};
							update[linhVat] = cuoc;
							BauCua_cuoc.findOneAndUpdate({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, {$inc:update}, function (err, cat){
								dataRed.forEach(function(o, i){
									data[o] = cat[i] + (i == linhVat ? cuoc : 0);
									return (data[o] = cat[i] + (i == linhVat ? cuoc : 0));
								});
								let dataT = {mini:{baucua:{data:data}}, user:{red:user.red}};
								client.redT.users[client.UID].forEach(function(obj){
									obj.red(dataT);
								});
							});

							io.baucua.ingame.forEach(function(uOld){
								if (uOld.uid == client.UID && uOld.red == red) {
									uOld[linhVat] += cuoc;
								}
							});
						}else{
							let create = {uid: client.UID, name: client.profile.name, phien: client.redT.BauCua_phien, red:red, time: new Date()};
							create[linhVat] = cuoc;
							BauCua_cuoc.create(create);
							data[dataRed[linhVat]] = cuoc;
							let dataT = {mini:{baucua:{data: data}}, user:{red:user.red}};
							client.redT.users[client.UID].forEach(function(obj){
								obj.red(dataT);
							});
							let addList = {uid:client.UID, name:client.profile.name, red:red, '0':0, '1':0, '2':0, '3':0, '4':0, '5':0};
							addList[linhVat] = cuoc;
							io.baucua.ingame.unshift(addList);
						}
					})
				}
			});
		}
	}
};
