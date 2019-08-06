
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaiXiu_userSchema = new Schema({
	uid: {type: String, required: true, unique: true},  // ID Người chơi

	tBigWinRed:   {type: Number,  default: 0}, // Red Thắng lớn nhất
	tBigLostRed:    {type: Number,  default: 0}, // Red Thua lớn nhất

	tWinRed:  {type: Number,  default: 0}, // Tổng red thắng
	tLostRed:   {type: Number,  default: 0}, // Tổng red thua

	tLineWinRed:   {type: Number,  default: 0}, // Dây thắng Red
	tLineLostRed:    {type: Number,  default: 0}, // Dây thua Red

	tLineWinRedH:{type: Number,  default: 0}, // Dây thắng Red hiện tại
	tLineLostRedH: {type: Number,  default: 0}, // Dây thua Red hiện tại

	tBigWinXu:    {type: Number,  default: 0}, // Xu Thắng lớn nhất
	tBigLostXu:     {type: Number,  default: 0}, // Xu Thua lớn nhất

	tWinXu:   {type: Number,  default: 0}, // Tổng xu thắng
	tLostXu:    {type: Number,  default: 0}, // Tổng xu thua

	tLineWinXu:    {type: Number,  default: 0}, // Dây thắng xu
	tLineLostXu:     {type: Number,  default: 0}, // Dây thua xu

	tLineWinXuH: {type: Number,  default: 0}, // Dây thắng xu hiện tại
	tLineLostXuH:  {type: Number,  default: 0}, // Dây thua xu hiện tại

	cBigWinRed:   {type: Number,  default: 0}, // Red Thắng lớn nhất
	cBigLostRed:    {type: Number,  default: 0}, // Red Thua lớn nhất

	cWinRed:  {type: Number,  default: 0}, // Tổng red thắng
	cLostRed:   {type: Number,  default: 0}, // Tổng red thua

	cLineWinRed:   {type: Number,  default: 0}, // Dây thắng Red
	cLineLostRed:    {type: Number,  default: 0}, // Dây thua Red

	cLineWinRedH:{type: Number,  default: 0}, // Dây thắng Red hiện tại
	cLineLostRedH: {type: Number,  default: 0}, // Dây thua Red hiện tại

	cBigWinXu:    {type: Number,  default: 0}, // Xu Thắng lớn nhất
	cBigLostXu:     {type: Number,  default: 0}, // Xu Thua lớn nhất

	cWinXu:   {type: Number,  default: 0}, // Tổng xu thắng
	cLostXu:    {type: Number,  default: 0}, // Tổng xu thua

	cLineWinXu:    {type: Number,  default: 0}, // Dây thắng xu
	cLineLostXu:     {type: Number,  default: 0}, // Dây thua xu

	cLineWinXuH: {type: Number,  default: 0}, // Dây thắng xu hiện tại
	cLineLostXuH:  {type: Number,  default: 0}, // Dây thua xu hiện tại
});

const TaiXiu_user = mongoose.model("TaiXiu_user", TaiXiu_userSchema);
module.exports = TaiXiu_user;
