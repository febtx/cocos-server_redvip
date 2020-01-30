
let UserInfo = require('./app/Models/UserInfo');
let HU       = require('./app/Models/HU');

let TaiXiu_one       = require('./app/Models/TaiXiu_one');
let TaiXiu_cuoc      = require('./app/Models/TaiXiu_cuoc');

///let MegaJP_user = require('./app/Models/MegaJP/MegaJP_user');

module.exports = function(){
	UserInfo.updateMany({}, {'$set':{'redWin':0, 'redLost':0, 'redPlay':0, 'totall':0}}).exec();
	HU.deleteMany({'red':false}).exec();
	TaiXiu_one.deleteMany({'red':false}).exec();
	TaiXiu_cuoc.deleteMany({'red':false}).exec();
	TaiXiu_cuoc.deleteMany({'taixiu':false}).exec();



	//MegaJP_user.deleteMany({}).exec();
	///**
	/**
	UserInfo.find({}, 'id', function(err, users){
		users.forEach(function(user){
			MegaJP_user.findOne({uid:user.id}, {}, function(err2, dataP){
				if (!dataP) {
					MegaJP_user.create({'uid':user.id});
				}
			});
		});
	});

	MegaJP_user.find({}, 'uid', function(err, users){
		users.forEach(function(user){
			UserInfo.findOne({id:user.uid}, '_id', function(err2, dataP){
				if (!dataP) {
					user.remove();
				}
			});
		});
	});
	*/
}
