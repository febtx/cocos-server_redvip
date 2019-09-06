

var HU             = require('../../Models/HU');

var Candy_red  = require('../../Models/Candy/Candy_red');
var Candy_xu   = require('../../Models/Candy/Candy_xu');
var Candy_user = require('../../Models/Candy/Candy_user');

var UserInfo       = require('../../Models/UserInfo');

var Helpers        = require('../../Helpers/Helpers');




function check_win(data, line){
	var win_icon = 0;
	var number_win = null;
	var arrT   = [];           // Mảng lọc các bộ
	for (var i = 0; i < 5; i++) {
		var dataT = data[i];
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}
	return Promise.all(arrT.map(function(c, index){
		if (c === 5) {
			win_icon = index;
			number_win = 5;
		}
		if (c === 4) {
			win_icon = index;
			number_win = 4;
		}
		if (c === 3) {
			win_icon = index;
			number_win = 3;
		}
		return void 0;
	})).then(result => {
		return {line: line, win: win_icon, type: number_win};
	})
}


module.exports = function(io, listBot){
	var list = [...listBot];
	if (list.length) {
		var max = (list.length*50/100)>>0;
		list = Helpers.shuffle(list);
		list = Helpers.shuffle(list);
		list = list.slice(0, max);
		Promise.all(list.map(function(user){
			spin(io, user);
		}))
	}
};
