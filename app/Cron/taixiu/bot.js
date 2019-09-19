
let TXCuoc      = require('../../Models/TaiXiu_cuoc');
let TXCuocOne   = require('../../Models/TaiXiu_one');

let UserInfo    = require('../../Models/UserInfo');

/**
 * Ngẫu nhiên cược
 * return {number}
*/
let random = function(){
	let a = (Math.random()*35)>>0;
	if (a == 34) {
		// 34
		return (Math.floor(Math.random()*(500-450+1))+450)*1000;
	}else if (a >= 32 && a < 34) {
		// 32 33
		return (Math.floor(Math.random()*(450-100+1))+100)*1000;
	}else if (a >= 30 && a < 32) {
		// 30 31 32
		return (Math.floor(Math.random()*(100-20+1))+20)*1000;
	}else if (a >= 26 && a < 30) {
		// 26 27 28 29
		return (Math.floor(Math.random()*(50-10+1))+10)*1000;
	}else if (a >= 21 && a < 26) {
		// 21 22 23 24 25
		return (Math.floor(Math.random()*(20-1+1))+1)*1000;
	}else if (a >= 15 && a < 21) {
		// 15 16 17 18 19 20
		return (Math.floor(Math.random()*(20-1+1))+1)*1000;
	}else if (a >= 8 && a < 15) {
		// 8 9 10 11 12 13 14
		return (Math.floor(Math.random()*(10-1+1))+1)*1000;
	}else{
		// 0 1 2 3 4 5 6 7
		return (Math.floor(Math.random()*(10-1+1))+1)*1000;
	}
};

/**
 * Danh sách bot
 * return {list}
*/
let list = function(){
	return new Promise((a, b) => {
		UserInfo.find({type: true}, 'id name', function(err, list){
			Promise.all(list.map(function(user){
				user = user._doc;
				delete user._id;

				return user;
			}))
			.then(result => {
				a(result);
			})
		});
	});
}

/**
 * Cược
*/
// Tài Xỉu RED
let bet = function(bot, io, taixiu = true, red = true){
	let cuoc   = random();
	let select = !!((Math.random()*2)>>0);
	if (select) {
		io.taixiu.taixiu.red_tai        += cuoc;
		io.taixiu.taixiu.red_player_tai += 1;
	}else{
		io.taixiu.taixiu.red_xiu        += cuoc;
		io.taixiu.taixiu.red_player_xiu += 1;
	}
	TXCuocOne.create({uid: bot.id, phien: io.TaiXiu_phien, taixiu:taixiu, select:select, red:red, bet:cuoc, type: true});
	TXCuoc.create({uid:bot.id, name:bot.name, phien: io.TaiXiu_phien, bet:cuoc, taixiu:taixiu, select:select, red:red, type: true, time:new Date()});
}

module.exports = {
	bet:  bet,
	list: list,
}
