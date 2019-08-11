
var TaiXiu_red_tong_tai   = 0;
var TaiXiu_red_tong_xiu   = 0;
var taixiu_red_player_tai = 0;
var taixiu_red_player_xiu = 0;
var taixiu_red_player_tai_temp = new Array();
var taixiu_red_player_xiu_temp = new Array();

var TaiXiu_xu_tong_tai   = 0;
var TaiXiu_xu_tong_xiu   = 0;
var taixiu_xu_player_tai = 0;
var taixiu_xu_player_xiu = 0;
var taixiu_xu_player_tai_temp = new Array();
var taixiu_xu_player_xiu_temp = new Array();

var ChanLe_red_tong_chan   = 0;
var ChanLe_red_tong_le     = 0;
var chanle_red_player_chan = 0;
var chanle_red_player_le   = 0;
var chanle_red_player_chan_temp = new Array();
var chanle_red_player_le_temp   = new Array();

var ChanLe_xu_tong_chan   = 0;
var ChanLe_xu_tong_le     = 0;
var chanle_xu_player_chan = 0;
var chanle_xu_player_le   = 0;
var chanle_xu_player_chan_temp = new Array();
var chanle_xu_player_le_temp   = new Array();

module.exports = function(io, list) {

	TaiXiu_red_tong_tai   = 0;
	TaiXiu_red_tong_xiu   = 0;
	taixiu_red_player_tai = 0;
	taixiu_red_player_xiu = 0;
	taixiu_red_player_tai_temp = [];
	taixiu_red_player_xiu_temp = [];

	TaiXiu_xu_tong_tai   = 0;
	TaiXiu_xu_tong_xiu   = 0;
	taixiu_xu_player_tai = 0;
	taixiu_xu_player_xiu = 0;
	taixiu_xu_player_tai_temp = [];
	taixiu_xu_player_xiu_temp = [];

	ChanLe_red_tong_chan   = 0;
	ChanLe_red_tong_le     = 0;
	chanle_red_player_chan = 0;
	chanle_red_player_le   = 0;
	chanle_red_player_chan_temp = [];
	chanle_red_player_le_temp   = [];

	ChanLe_xu_tong_chan   = 0;
	ChanLe_xu_tong_le     = 0;
	chanle_xu_player_chan = 0;
	chanle_xu_player_le   = 0;
	chanle_xu_player_chan_temp = [];
	chanle_xu_player_le_temp   = [];

	Promise.all(list.filter(function(obj){
		if (obj.taixiu == true && obj.red == true && obj.select == true && obj.type == false) {           // Tổng Red Tài
			TaiXiu_red_tong_tai += obj.bet;
			if(taixiu_red_player_tai_temp[obj.name] === void 0) taixiu_red_player_tai_temp[obj.name] = 1;
		} else if (obj.taixiu == true && obj.red == true && obj.select == false && obj.type == false) {   // Tổng Red Xỉu
			TaiXiu_red_tong_xiu += obj.bet;
			if(taixiu_red_player_xiu_temp[obj.name] === void 0) taixiu_red_player_xiu_temp[obj.name] = 1;
		} else if (obj.taixiu == true && obj.red == false && obj.select == true && obj.type == false) {   // Tổng Xu Tài
			TaiXiu_xu_tong_tai += obj.bet;
			if(taixiu_xu_player_tai_temp[obj.name] === void 0) taixiu_xu_player_tai_temp[obj.name] = 1;
		} else if (obj.taixiu == true && obj.red == false && obj.select == false && obj.type == false) {  // Tổng Xu Xỉu
			TaiXiu_xu_tong_xiu += obj.bet;
			if(taixiu_xu_player_xiu_temp[obj.name] === void 0) taixiu_xu_player_xiu_temp[obj.name] = 1;
		} else if (obj.taixiu == false && obj.red == true && obj.select == true && obj.type == false) {   // Tổng Red Chẵn
			ChanLe_red_tong_chan += obj.bet;
			if(chanle_red_player_chan_temp[obj.name] === void 0) chanle_red_player_chan_temp[obj.name] = 1;
		} else if (obj.taixiu == false && obj.red == true && obj.select == false && obj.type == false) {  // Tổng Red Lẻ
			ChanLe_red_tong_le += obj.bet;
			if(chanle_red_player_le_temp[obj.name] === void 0) chanle_red_player_le_temp[obj.name] = 1;
		} else if (obj.taixiu == false && obj.red == false && obj.select == true && obj.type == false) {  // Tổng xu Chẵn
			ChanLe_xu_tong_chan += obj.bet;
			if(chanle_xu_player_chan_temp[obj.name] === void 0) chanle_xu_player_chan_temp[obj.name] = 1;
		} else if (obj.taixiu == false && obj.red == false && obj.select == false && obj.type == false) { // Tổng xu Lẻ
			ChanLe_xu_tong_le += obj.bet;
			if(chanle_xu_player_le_temp[obj.name] === void 0) chanle_xu_player_le_temp[obj.name] = 1;
		}
		return (obj.type == false);
	}))
	.then(function(arrayOfResults){
		var temp_dataA = {taixiu:{taixiu:{red_tai: TaiXiu_red_tong_tai,red_xiu: TaiXiu_red_tong_xiu,xu_tai: TaiXiu_xu_tong_tai,xu_xiu: TaiXiu_xu_tong_xiu,red_player_tai: Object.keys(taixiu_red_player_tai_temp).length,red_player_xiu: Object.keys(taixiu_red_player_xiu_temp).length,xu_player_tai: Object.keys(taixiu_xu_player_tai_temp).length,xu_player_xiu: Object.keys(taixiu_xu_player_xiu_temp).length,},chanle:{red_chan: ChanLe_red_tong_chan,red_le: ChanLe_red_tong_le,xu_chan: ChanLe_xu_tong_chan,xu_le: ChanLe_xu_tong_le,red_player_chan: Object.keys(chanle_red_player_chan_temp).length,red_player_le: Object.keys(chanle_red_player_le_temp).length,xu_player_chan: Object.keys(chanle_xu_player_chan_temp).length,xu_player_le: Object.keys(chanle_xu_player_le_temp).length}, list:arrayOfResults}};
		Promise.all(Object.values(io.admins).map(function(admin){
			Promise.all(admin.map(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu)
					client.red(temp_dataA); // list
			}));
		}));
	});
}
