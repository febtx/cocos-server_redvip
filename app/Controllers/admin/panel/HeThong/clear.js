
// OTP
var OTP                = require('../../../../Models/OTP');

/**
// Mua Xu
var MuaXu              = require('../../../../Models/MuaXu');

// Nạp Thẻ
var NapThe             = require('../../../../Models/NapThe');

// Mua Thẻ
var MuaThe             = require('../../../../Models/MuaThe');
var MuaThe_card        = require('../../../../Models/MuaThe_card');

// Chuyển Red
var ChuyenRed          = require('../../../../Models/ChuyenRed');
*/

// Gift Code
var GiftCode           = require('../../../../Models/GiftCode');

// Tài Xỉu
var TaiXiu_phien       = require('../../../../Models/TaiXiu_phien');
var TaiXiu_one         = require('../../../../Models/TaiXiu_one');
var TaiXiu_cuoc        = require('../../../../Models/TaiXiu_cuoc');
var TaiXiu_chat        = require('../../../../Models/TaiXiu_chat');

// AngryBirds
var AngryBirds_red     = require('../../../../Models/AngryBirds/AngryBirds_red');
var AngryBirds_xu      = require('../../../../Models/AngryBirds/AngryBirds_xu');

// BauCua
var BauCua_phien       = require('../../../../Models/BauCua/BauCua_phien');
var BauCua_cuoc        = require('../../../../Models/BauCua/BauCua_cuoc');

// BigBabol
var BigBabol_red       = require('../../../../Models/BigBabol/BigBabol_red');
var BigBabol_xu        = require('../../../../Models/BigBabol/BigBabol_xu');

// CaoThap
var CaoThap_red        = require('../../../../Models/CaoThap/CaoThap_red');
var CaoThap_xu         = require('../../../../Models/CaoThap/CaoThap_xu');
var CaoThap_redbuoc    = require('../../../../Models/CaoThap/CaoThap_redbuoc');
var CaoThap_xubuoc     = require('../../../../Models/CaoThap/CaoThap_xubuoc');

// Mini3Cay
var Mini3Cay_red       = require('../../../../Models/Mini3Cay/Mini3Cay_red');
var Mini3Cay_xu        = require('../../../../Models/Mini3Cay/Mini3Cay_xu');

// miniPoker
var miniPokerRed       = require('../../../../Models/miniPoker/miniPokerRed');
var miniPokerXu        = require('../../../../Models/miniPoker/miniPokerXu');

// VuongQuocRed
var VuongQuocRed_red   = require('../../../../Models/VuongQuocRed/VuongQuocRed_red');
var VuongQuocRed_xu    = require('../../../../Models/VuongQuocRed/VuongQuocRed_xu');

module.exports = function(client) {
	// OTP
	var otpTime = new Date()-180000;      // 3 phút
	OTP.deleteMany({$or:[{'active':true}, {'date':{$lt: otpTime}}]}).exec();

	/**
	// Mua Xu
	var MuaXuTime = new Date()-604800000; // 7 ngày
	MuaXu.deleteMany({'time':{$lt: MuaXuTime}}).exec();
	*/

	// GiftCode
	var GiftCodeTime = new Date();     // GiftCode hết hạn
	GiftCode.deleteMany({'todate':{$lt: GiftCodeTime}}).exec();

	// Tài Xỉu
	TaiXiu_phien.findOne({}, 'id', {sort:{'_id': -1}}, function(err, data){
		if (!!data && data.id > 200) {
			var phien = data.id-200;
			TaiXiu_one.deleteMany({'phien':{$lt: phien}}).exec();
			TaiXiu_cuoc.deleteMany({'phien':{$lt: phien}}).exec();
		}
	});
	TaiXiu_chat.deleteMany({}).exec();

	/**
	// AngryBirds
	AngryBirds_red
	AngryBirds_xu
	*/
}
