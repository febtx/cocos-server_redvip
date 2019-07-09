
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaiXiu_userSchema = new Schema({
	uid: {type: String, required: true, unique: true},  // ID Người chơi

	t_thang_lon_red:   {type: Number,  default: 0},  // Red Thắng lớn nhất
	t_thua_lon_red:    {type: Number,  default: 0},  // Red Thua lớn nhất

	t_tong_thang_red:  {type: Number,  default: 0}, // Tổng red thắng
	t_tong_thua_red:   {type: Number,  default: 0}, // Tổng red thua

	t_day_thang_red:   {type: Number,  default: 0}, // Dây thắng Red
	t_day_thua_red:    {type: Number,  default: 0}, // Dây thua Red

	t_day_thang_red_ht:{type: Number,  default: 0}, // Dây thắng Red hiện tại
	t_day_thua_red_ht: {type: Number,  default: 0}, // Dây thua Red hiện tại

	t_thang_lon_xu:    {type: Number,  default: 0},  // Xu Thắng lớn nhất
	t_thua_lon_xu:     {type: Number,  default: 0},  // Xu Thua lớn nhất

	t_tong_thang_xu:   {type: Number,  default: 0},  // Tổng xu thắng
	t_tong_thua_xu:    {type: Number,  default: 0}, // Tổng xu thua

	t_day_thang_xu:    {type: Number,  default: 0}, // Dây thắng xu
	t_day_thua_xu:     {type: Number,  default: 0}, // Dây thua xu

	t_day_thang_xu_ht: {type: Number,  default: 0}, // Dây thắng xu hiện tại
	t_day_thua_xu_ht:  {type: Number,  default: 0}, // Dây thua xu hiện tại

	c_thang_lon_red:   {type: Number,  default: 0},  // Red Thắng lớn nhất
	c_thua_lon_red:    {type: Number,  default: 0},  // Red Thua lớn nhất

	c_tong_thang_red:  {type: Number,  default: 0}, // Tổng red thắng
	c_tong_thua_red:   {type: Number,  default: 0}, // Tổng red thua

	c_day_thang_red:   {type: Number,  default: 0}, // Dây thắng Red
	c_day_thua_red:    {type: Number,  default: 0}, // Dây thua Red

	c_day_thang_red_ht:{type: Number,  default: 0}, // Dây thắng Red hiện tại
	c_day_thua_red_ht: {type: Number,  default: 0}, // Dây thua Red hiện tại

	c_thang_lon_xu:    {type: Number,  default: 0},  // Xu Thắng lớn nhất
	c_thua_lon_xu:     {type: Number,  default: 0},  // Xu Thua lớn nhất

	c_tong_thang_xu:   {type: Number,  default: 0},  // Tổng xu thắng
	c_tong_thua_xu:    {type: Number,  default: 0}, // Tổng xu thua

	c_day_thang_xu:    {type: Number,  default: 0}, // Dây thắng xu
	c_day_thua_xu:     {type: Number,  default: 0}, // Dây thua xu

	c_day_thang_xu_ht: {type: Number,  default: 0}, // Dây thắng xu hiện tại
	c_day_thua_xu_ht:  {type: Number,  default: 0}, // Dây thua xu hiện tại
});

const TaiXiu_user = mongoose.model("TaiXiu_user", TaiXiu_userSchema);
module.exports = TaiXiu_user;
