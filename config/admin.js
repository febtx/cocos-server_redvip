
// Khởi tạo dữ liệu

// Admin
const Admin   = require('../app/Models/Admin');
const helpers = require('../app/Helpers/Helpers');

Admin.estimatedDocumentCount().exec(function(err, total){
	if (total == 0) {
		Admin.create({'username': 'admin', 'password': helpers.generateHash('12345'), 'rights': 9, 'regDate': new Date()});
	}
})

// thiết lập game miniPoker
const miniPokerHu = require('../app/Models/miniPoker/miniPokerHu');
// red
miniPokerHu.findOne({type:100, red: true}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 100, red: true, 'bet': 400000, 'min': 400000});
	}
})

miniPokerHu.findOne({type:1000, red: true}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 1000, red: true, 'bet': 4000000, 'min': 4000000});
	}
})

miniPokerHu.findOne({type:10000, red: true}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 10000, red: true, 'bet': 40000000, 'min': 40000000});
	}
})

// xu
miniPokerHu.findOne({type:100, red: false}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 100, red: false, 'bet': 400000, 'min': 400000});
	}
})

miniPokerHu.findOne({type:1000, red: false}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 1000, red: false, 'bet': 4000000, 'min': 4000000});
	}
})

miniPokerHu.findOne({type:10000, red: false}, {}, function(err, data){
	if (!data) {
		miniPokerHu.create({'type': 10000, red: false, 'bet': 40000000, 'min': 40000000});
	}
})







// thiết lập game BigBabol
const BigBabol_hu = require('../app/Models/BigBabol/BigBabol_hu');
// red
BigBabol_hu.findOne({type:100, red: true}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

BigBabol_hu.findOne({type:1000, red: true}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

BigBabol_hu.findOne({type:10000, red: true}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// xu
BigBabol_hu.findOne({type:100, red: false}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 100, red: false, 'bet': 500000, 'min': 500000});
	}
})

BigBabol_hu.findOne({type:1000, red: false}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 1000, red: false, 'bet': 5000000, 'min': 5000000});
	}
})

BigBabol_hu.findOne({type:10000, red: false}, {}, function(err, data){
	if (!data) {
		BigBabol_hu.create({'type': 10000, red: false, 'bet': 50000000, 'min': 50000000});
	}
})









const VuongQuocRed_hu  = require('../app/Models/VuongQuocRed/VuongQuocRed_hu');
// thiết lập game VuongQuocRed
// red
VuongQuocRed_hu.findOne({type:100, red: true}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

VuongQuocRed_hu.findOne({type:1000, red: true}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

VuongQuocRed_hu.findOne({type:10000, red: true}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// xu
VuongQuocRed_hu.findOne({type:100, red: false}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 100, red: false, 'bet': 500000, 'min': 500000});
	}
})

VuongQuocRed_hu.findOne({type:1000, red: false}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 1000, red: false, 'bet': 5000000, 'min': 5000000});
	}
})

VuongQuocRed_hu.findOne({type:10000, red: false}, {}, function(err, data){
	if (!data) {
		VuongQuocRed_hu.create({'type': 10000, red: false, 'bet': 50000000, 'min': 50000000});
	}
})



// Bầu Cua
const BauCua = require('../app/Models/BauCua/BauCua_temp');
BauCua.findOne({}, {}, function(err, data){
	if (!data) {
		BauCua.create({});
	}
})











const Mini3Cay_hu  = require('../app/Models/Mini3Cay/Mini3Cay_hu');
// thiết lập game Mini3Cay
// red
Mini3Cay_hu.findOne({type:100, red: true}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 100, red: true, 'bet': 250000, 'min': 250000});
	}
})

Mini3Cay_hu.findOne({type:1000, red: true}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 1000, red: true, 'bet': 2500000, 'min': 2500000});
	}
})

Mini3Cay_hu.findOne({type:10000, red: true}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 10000, red: true, 'bet': 25000000, 'min': 25000000});
	}
})

// xu
Mini3Cay_hu.findOne({type:100, red: false}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 100, red: false, 'bet': 250000, 'min': 250000});
	}
})

Mini3Cay_hu.findOne({type:1000, red: false}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 1000, red: false, 'bet': 2500000, 'min': 2500000});
	}
})

Mini3Cay_hu.findOne({type:10000, red: false}, {}, function(err, data){
	if (!data) {
		Mini3Cay_hu.create({'type': 10000, red: false, 'bet': 25000000, 'min': 25000000});
	}
})


const HU = require('../app/Models/HU');

// thiết lập Hũ Cao Thấp
// red
HU.findOne({game:'caothap', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 1000, red: true, 'bet': 7000, 'min': 7000});
	}
})

HU.findOne({game:'caothap', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 10000, red: true, 'bet': 70000, 'min': 70000});
	}
})

HU.findOne({game:'caothap', type:50000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 50000, red: true, 'bet': 350000, 'min': 350000});
	}
})

HU.findOne({game:'caothap', type:100000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 100000, red: true, 'bet': 700000, 'min': 700000});
	}
})

HU.findOne({game:'caothap', type:500000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 500000, red: true, 'bet': 3500000, 'min': 3500000});
	}
})

// xu
HU.findOne({game:'caothap', type:1000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 1000, red: false, 'bet': 7000, 'min': 7000});
	}
})

HU.findOne({game:'caothap', type:10000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 10000, red: false, 'bet': 70000, 'min': 70000});
	}
})

HU.findOne({game:'caothap', type:50000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 50000, red: false, 'bet': 350000, 'min': 350000});
	}
})

HU.findOne({game:'caothap', type:100000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 100000, red: false, 'bet': 700000, 'min': 700000});
	}
})

HU.findOne({game:'caothap', type:500000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 500000, red: false, 'bet': 3500000, 'min': 3500000});
	}
})


// thiết lập Hũ AngryBirds
// red
HU.findOne({game:'arb', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'arb', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'arb', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// xu
HU.findOne({game:'arb', type:100, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 100, red: false, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'arb', type:1000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 1000, red: false, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'arb', type:10000, red: false}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 10000, red: false, 'bet': 50000000, 'min': 50000000});
	}
})

