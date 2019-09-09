
const bcrypt = require("bcrypt-nodejs")

// mã hóa pass
const generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
}
// so sánh pass
const validPassword = function(password, Hash) {
	return bcrypt.compareSync(password, Hash)
}

const cutEmail = function(email) {
	var data = email.split("@");
	var string = "";
	var start = '';
	if (data[0].length > 7) {
		start = data[0].slice(0, 6);
	}else{
		start = data[0].slice(0, data[0].length-3);
	}
	return string.concat(start, '***@', data[1]);
}

const cutPhone = function(phone) {
	var string = "";
	var start = phone.slice(0, 3);
	var end   = phone.slice(phone.length-2, phone.length);
	return string.concat(start, '*****', end);
}

const validateEmail = function(t) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t)
}

const checkPhoneValid = function(phone) {
	return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)
}

const nFormatter = function(t, e) {
	for (var i = [{
		value: 1e18,
		symbol: "E"
	}, {
		value: 1e15,
		symbol: "P"
	}, {
		value: 1e12,
		symbol: "T"
	}, {
		value: 1e9,
		symbol: "G"
	}, {
		value: 1e6,
		symbol: "M"
	}, {
		value: 1e3,
		symbol: "k"
	}], o = /\.0+$|(\.[0-9]*[1-9])0+$/, n = 0; n < i.length; n++)
		if (t >= i[n].value)
			return (t / i[n].value).toFixed(e).replace(o, "$1") + i[n].symbol;
	return t.toFixed(e).replace(o, "$1")
}
const anPhanTram = function(bet, so_nhan, ti_le, type = false){
	// so_nhan: số nhân
	// ti_le: tỉ lệ thuế
	// type: Thuế tổng, thuế gốc
	var vV = bet*so_nhan;
	var vT = !!type ? vV : bet;
	return vV-Math.ceil(vT*ti_le/100);
}
// kiểm tra chuỗi chống
const isEmpty = function(str) {
	return (!str || 0 === str.length)
}
// đổi số thành tiền
const numberWithCommas = function(number) {
	if (number) {
		var result = (number = parseInt(number)).toString().split(".");
		return result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."),
		result.join(".")
	}
	return "0"
}
// Lấy số từ chuỗi
const getOnlyNumberInString = function(t) {
	var e = t.match(/\d+/g);
	return e ? e.join("") : ""
}

// thêm số 0 trước dãy số (lấp đầy bằng số 0)
const numberPad = function(number, length) {
	// number: số
	// length: độ dài dãy số
	var str = '' + number
	while(str.length < length)
		str = '0' + str

	return str
}

function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random()*m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function ThongBaoNoHu(io, data){
	Promise.all(Object.values(io.users).map(function(users){
		Promise.all(users.map(function(client){
			if(client.scene == "home" && io.UID != client.UID){
				client.red({pushnohu:data});
			}
		}));
	}));
	io.sendAllClient({pushnohu:data});
}

function ThongBaoBigWin(io, data){
	Promise.all(Object.values(io.users).map(function(users){
		Promise.all(users.map(function(client){
			if(client.scene == "home" && io.UID != client.UID){
				client.red({news:{t:data}});
			}
		}));
	}));
	io.sendAllClient({news:{t:data}});
}

module.exports = {
	generateHash:  generateHash,
	validPassword: validPassword,
	anPhanTram:    anPhanTram,
	isEmpty:       isEmpty,
	numberWithCommas: numberWithCommas,
	getOnlyNumberInString: getOnlyNumberInString,
	numberPad:       numberPad,
	shuffle:         shuffle,
	validateEmail:   validateEmail,
	checkPhoneValid: checkPhoneValid,
	nFormatter:      nFormatter,
	ThongBaoNoHu:    ThongBaoNoHu,
	ThongBaoBigWin:  ThongBaoBigWin,
	cutEmail:        cutEmail,
	cutPhone:        cutPhone,
}
