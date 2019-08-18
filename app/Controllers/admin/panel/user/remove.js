
// Users Info
var Users              = require('../../../../Models/Users');
var UserInfo           = require('../../../../Models/UserInfo');

// OTP
var OTP                = require('../../../../Models/OTP');

// Mua Xu
var MuaXu              = require('../../../../Models/MuaXu');

// Nạp Thẻ
var NapThe             = require('../../../../Models/NapThe');

// Mua Thẻ
var MuaThe             = require('../../../../Models/MuaThe');
var MuaThe_card        = require('../../../../Models/MuaThe_card');

// Chuyển Red
//var ChuyenRed          = require('../../../../Models/ChuyenRed');

// Tài Xỉu
var TaiXiu_user        = require('../../../../Models/TaiXiu_user');
var TaiXiu_one         = require('../../../../Models/TaiXiu_one');
var TaiXiu_cuoc        = require('../../../../Models/TaiXiu_cuoc');
var TaiXiu_chat        = require('../../../../Models/TaiXiu_chat');

// AngryBirds
var AngryBirds_user    = require('../../../../Models/AngryBirds/AngryBirds_user');
var AngryBirds_red     = require('../../../../Models/AngryBirds/AngryBirds_red');
var AngryBirds_xu      = require('../../../../Models/AngryBirds/AngryBirds_xu');

// BauCua
var BauCua_user        = require('../../../../Models/BauCua/BauCua_user');
var BauCua_cuoc        = require('../../../../Models/BauCua/BauCua_cuoc');

// BigBabol
var BigBabol_user      = require('../../../../Models/BigBabol/BigBabol_users');
var BigBabol_red       = require('../../../../Models/BigBabol/BigBabol_red');
var BigBabol_xu        = require('../../../../Models/BigBabol/BigBabol_xu');

// CaoThap
var CaoThap_user       = require('../../../../Models/CaoThap/CaoThap_user');
var CaoThap_red        = require('../../../../Models/CaoThap/CaoThap_red');
var CaoThap_xu         = require('../../../../Models/CaoThap/CaoThap_xu');
var CaoThap_redbuoc    = require('../../../../Models/CaoThap/CaoThap_redbuoc');
var CaoThap_xubuoc     = require('../../../../Models/CaoThap/CaoThap_xubuoc');

// Mini3Cay
var Mini3Cay_user      = require('../../../../Models/Mini3Cay/Mini3Cay_user');
var Mini3Cay_red       = require('../../../../Models/Mini3Cay/Mini3Cay_red');
var Mini3Cay_xu        = require('../../../../Models/Mini3Cay/Mini3Cay_xu');

// miniPoker
var miniPoker_user     = require('../../../../Models/miniPoker/miniPoker_users');
var miniPokerRed       = require('../../../../Models/miniPoker/miniPokerRed');
var miniPokerXu        = require('../../../../Models/miniPoker/miniPokerXu');

// VuongQuocRed
var VuongQuocRed_user  = require('../../../../Models/VuongQuocRed/VuongQuocRed_users');
var VuongQuocRed_red   = require('../../../../Models/VuongQuocRed/VuongQuocRed_red');
var VuongQuocRed_xu    = require('../../../../Models/VuongQuocRed/VuongQuocRed_xu');

module.exports = function(client, id){
	UserInfo.findOne({'id': id}, 'name', function(err, data){
		if (!!data) {
			// thực hiện xóa @@
			var regex = new RegExp("^" + data.name + "$", 'i');

			Users.findOneAndDelete({'_id': id}).exec();
			UserInfo.findOneAndDelete({'id': id}).exec();

			OTP.deleteMany({'uid': id}).exec();

			MuaXu.deleteMany({'uid': id}).exec();

			NapThe.deleteMany({'uid': id}).exec();

			MuaThe.find({'uid': id}, '_id', function(errMT, dataMT){
				Promise.all(dataMT.map(function(cart){
					MuaThe_card.deleteMany({'cart': cart._id}).exec();
				}));
				MuaThe.deleteMany({'uid': id}).exec();
			});

			// Tài Xỉu
			TaiXiu_user.findOneAndDelete({'uid': id}).exec();
			TaiXiu_one.deleteMany({'uid': id}).exec();
			TaiXiu_cuoc.deleteMany({'uid': id}).exec();
			TaiXiu_chat.deleteMany({'uid': id}).exec();

			// AngryBirds
			AngryBirds_user.findOneAndDelete({'uid': id}).exec();
			AngryBirds_red.deleteMany({'name': {$regex: regex}}).exec();
			AngryBirds_xu.deleteMany({'name': {$regex: regex}}).exec();

			// BauCua
			BauCua_user.findOneAndDelete({'uid': id}).exec();
			BauCua_cuoc.deleteMany({'uid': id}).exec();

			// BigBabol
			BigBabol_user.findOneAndDelete({'uid': id}).exec();
			BigBabol_red.deleteMany({'name': {$regex: regex}}).exec();
			BigBabol_xu.deleteMany({'name': {$regex: regex}}).exec();

			// CaoThap
			CaoThap_user.findOneAndDelete({'uid': id}).exec();
			CaoThap_red.deleteMany({'uid': id}).exec();
			CaoThap_xu.deleteMany({'uid': id}).exec();
			CaoThap_redbuoc.deleteMany({'uid': id}).exec();
			CaoThap_xubuoc.deleteMany({'uid': id}).exec();

			// Mini3Cay
			Mini3Cay_user.findOneAndDelete({'uid': id}).exec();
			Mini3Cay_red.deleteMany({'uid': id}).exec();
			Mini3Cay_xu.deleteMany({'uid': id}).exec();

			// miniPoker
			miniPoker_user.findOneAndDelete({'uid': id}).exec();
			miniPokerRed.deleteMany({'name': {$regex: regex}}).exec();
			miniPokerXu.deleteMany({'name': {$regex: regex}}).exec();

			// VuongQuocRed
			VuongQuocRed_user.findOneAndDelete({'uid': id}).exec();
			VuongQuocRed_red.deleteMany({'name': {$regex: regex}}).exec();
			VuongQuocRed_xu.deleteMany({'name': {$regex: regex}}).exec();
		}
	});
}
