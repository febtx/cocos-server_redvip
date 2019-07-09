
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	uid: {type: String, required: true, unique: true}, // ID Người chơi

	red:      {type: Number,  default: 0},       // Tổng red thắng
	red_lost: {type: Number,  default: 0},       // Tổng red thua
	xu:       {type: Number,  default: 0},       // Tổng xu thắng
	xu_lost:  {type: Number,  default: 0},       // Tổng xu thua
	thuong:   {type: Number,  default: 0},       // Thưởng Red khi chơi Xu

	weekly_huou:    {type: Number,  default: 0}, // Tích luỹ Hươu Tuần trước
	weekly_bau:     {type: Number,  default: 0}, // Tích luỹ Bầu Tuần trước
	weekly_ga:      {type: Number,  default: 0}, // Tích luỹ Gà Tuần trước
	weekly_ca:      {type: Number,  default: 0}, // Tích luỹ Cá Tuần trước
	weekly_cua:     {type: Number,  default: 0}, // Tích luỹ Cua Tuần trước
	weekly_tom:     {type: Number,  default: 0}, // Tích luỹ Tôm Tuần trước

	huou:           {type: Number,  default: 0}, // Tích luỹ Hươu Tuần này
	bau:            {type: Number,  default: 0}, // Tích luỹ Bầu Tuần này
	ga:             {type: Number,  default: 0}, // Tích luỹ Gà Tuần này
	ca:             {type: Number,  default: 0}, // Tích luỹ Cá Tuần này
	cua:            {type: Number,  default: 0}, // Tích luỹ Cua Tuần này
	tom:            {type: Number,  default: 0}, // Tích luỹ Tôm Tuần này

	weekly_huouXu:  {type: Number,  default: 0}, // Tích luỹ XU Hươu Tuần trước
	weekly_bauXu:   {type: Number,  default: 0}, // Tích luỹ XU Bầu Tuần trước
	weekly_gaXu:    {type: Number,  default: 0}, // Tích luỹ XU Gà Tuần trước
	weekly_caXu:    {type: Number,  default: 0}, // Tích luỹ XU Cá Tuần trước
	weekly_cuaXu:   {type: Number,  default: 0}, // Tích luỹ XU Cua Tuần trước
	weekly_tomXu:   {type: Number,  default: 0}, // Tích luỹ XU Tôm Tuần trước

	huouXu:         {type: Number,  default: 0}, // Tích luỹ XU Hươu Tuần này
	bauXu:          {type: Number,  default: 0}, // Tích luỹ XU Bầu Tuần này
	gaXu:           {type: Number,  default: 0}, // Tích luỹ XU Gà Tuần này
	caXu:           {type: Number,  default: 0}, // Tích luỹ XU Cá Tuần này
	cuaXu:          {type: Number,  default: 0}, // Tích luỹ XU Cua Tuần này
	tomXu:          {type: Number,  default: 0}, // Tích luỹ XU Tôm Tuần này
});

module.exports = mongoose.model("BauCua_user", Schema);
