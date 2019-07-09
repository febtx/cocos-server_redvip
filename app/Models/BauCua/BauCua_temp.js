
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	red: {
		0: {type: Number,  default: 0}, // Số RED đặt Hươu
		1: {type: Number,  default: 0}, // Số RED đặt Bầu
		2: {type: Number,  default: 0}, // Số RED đặt Gà
		3: {type: Number,  default: 0}, // Số RED đặt Cá
		4: {type: Number,  default: 0}, // Số RED đặt Cua
		5: {type: Number,  default: 0}, // Số RED đặt Tôm
	},

	xu: {
		0: {type: Number,  default: 0}, // Số XU đặt Hươu
		1: {type: Number,  default: 0}, // Số XU đặt Bầu
		2: {type: Number,  default: 0}, // Số XU đặt Gà
		3: {type: Number,  default: 0}, // Số XU đặt Cá
		4: {type: Number,  default: 0}, // Số XU đặt Cua
		5: {type: Number,  default: 0}, // Số XU đặt Tôm
	},

	0: {type: Number,  default: 0}, // Số lần về Hươu
	1: {type: Number,  default: 0}, // Số lần về Bầu
	2: {type: Number,  default: 0}, // Số lần về Gà
	3: {type: Number,  default: 0}, // Số lần về Cá
	4: {type: Number,  default: 0}, // Số lần về Cua
	5: {type: Number,  default: 0}, // Số lần về Tôm

	huRed: {type: Number,  default: 0}, // Hũ RED
	huXu:  {type: Number,  default: 0}, // Hũ Xu
	minHuRed: {type: Number,  default: 0}, // Hũ RED
	minHuXu:  {type: Number,  default: 0}, // Hũ Xu
});

module.exports = mongoose.model("BauCua_temp", Schema);;
