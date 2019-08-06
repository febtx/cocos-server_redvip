
module.exports = {
	/**
	data: {
		"2":  1.05,
		"3":  1.16,
		"4":  1.28,
		"5":  1.44,
		"6":  1.63,
		"7":  1.9,
		"8":  2.27,
		"9":  2.83,
		"10": 3.76,
		"11": 5.62,
		"12": 11.2,
	},
	*/
	data: {
		"2":  5,
		"3":  16,
		"4":  28,
		"5":  44,
		"6":  63,
		"7":  90,
		"8":  127,
		"9":  183,
		"10": 276,
		"11": 462,
		"12": 1020,
	},
	getT: function(card, phe, buoc){
		//card   Thẻ bài 0=>12
		//phe    Phế game
		//buoc   Số bước hiện tại
		//var up   = (this.data[card]-(phe/100))*(12/(12+buoc));
		//var down = (this.data[14-card]-(phe/100))*(12/(12+buoc));

		//var up   = (this.data[card]-(phe/100));
		//var down = (this.data[14-card]-(phe/100));

		var up   = ((this.data[card]-phe)/100)*(8/(8+buoc));
		var down = ((this.data[14-card]-phe)/100)*(8/(8+buoc));

		return {up:up, down:down};
	},
}
