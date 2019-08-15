
var HU = require('../Models/HU');

module.exports = function() {
	var file_angrybird = require('../../config/angrybird.json');
	var file_bigbabol  = require('../../config/bigbabol.json');
	var file_minipoker = require('../../config/minipoker.json');

	var timeNow = new Date();
	timeNow = timeNow.getDay();

	HU.findOne({game: "arb", type:100, red:true}, 'bet min', function(err, angrybird){
		if (file_angrybird[timeNow]) {
			HU.findOneAndUpdate({game: "arb", type:100, red:true}, {$set:{'toX6': file_angrybird.toX6, 'X6': file_angrybird.X6}}, function(err,cat){});
		}else{
			HU.findOneAndUpdate({game: "arb", type:100, red:true}, {$set:{'toX6': 0, 'X6': 0, 'bet': angrybird.min}}, function(err,cat){});
		}
	});

	HU.findOne({game: "bigbabol", type:100, red:true}, 'bet min', function(err, bigbabol){
		if (file_bigbabol[timeNow]) {
			HU.findOneAndUpdate({game: "bigbabol", type:100, red:true}, {$set:{'toX6': file_bigbabol.toX6, 'X6': file_bigbabol.X6}}, function(err,cat){});
		}else{
			HU.findOneAndUpdate({game: "bigbabol", type:100, red:true}, {$set:{'toX6': 0, 'X6': 0, 'bet': bigbabol.min}}, function(err,cat){});
		}
	});

	HU.findOne({game: "minipoker", type:100, red:true}, 'bet min', function(err, minipoker){
		if (file_minipoker[timeNow]) {
			HU.findOneAndUpdate({game: "minipoker", type:100, red:true}, {$set:{'toX6': file_minipoker.toX6, 'X6': file_minipoker.X6}}, function(err,cat){});
		}else{
			HU.findOneAndUpdate({game: "minipoker", type:100, red:true}, {$set:{'toX6': 0, 'X6': 0, 'bet': minipoker.min}}, function(err,cat){});
		}
	});
};
