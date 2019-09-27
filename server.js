
// server.js

let Telegram      = require('node-telegram-bot-api');
let TelegramToken = '987211295:AAGlIN124PtI_g3VXSWXczTrc_ri9BBx-ek';

//let TelegramToken = '819726159:AAFMBPuQ5AAZJ60kFaQfEzqZrp_dyTE7mwI';

let TelegramBot   = new Telegram(TelegramToken, {polling: true});

let express    = require("express");
let app        = express();
let port       = process.env.PORT || 80;
let expressWs  = require('express-ws')(app);
let bodyParser = require("body-parser");



// let helmetCSP = require('helmet-csp');

/**
app.use(helmetCSP({
	directives: {
	    connectSrc: ["'self'", "ws://127.0.0.1/*"]
	}
}));
*/

//var Ddos = require('ddos');
//var ddos = new Ddos;
//app.use(ddos.express)

//let path  = require("path");
//let flash = require("connect-flash");

//let cookieParser = require("cookie-parser");
//let session      = require("express-session");


// Setting & Connect to the Database
let configDB = require("./config/database");
let mongoose = require("mongoose");

require('mongoose-long')(mongoose); // INT 64bit

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex",   true);
mongoose.connect(configDB.url, configDB.options); // kết nối tới database

// cấu hình tài khoản admin mặc định và các dữ liệu mặc định
require("./config/admin");

// Cấu hình ứng dụng express
// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true
}));
*/
//app.use(morgan("dev"));  // sử dụng để log mọi request ra console
//app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
//app.use(flash()); 

app.set("view engine", "ejs"); // chỉ định view engine là ejs
app.set("views", "./views");   // chỉ định thư mục view

// Serve static html, js, css, and image files from the "public" directory
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// server socket
let redT = expressWs.getWss();
redT.telegram = TelegramBot;

require('./app/Helpers/socketUser')(redT); // Add function socket

require('./routerHttp')(app, redT);   // load các routes HTTP
require('./routerSocket')(app, redT); // load các routes WebSocket

require("./app/Cron/taixiu")(redT);   // Chạy game Tài Xỉu
require("./app/Cron/baucua")(redT);   // Chạy game Bầu Cua

require("./config/cron")();

require("./app/Telegram/Telegram")(TelegramBot); // Telegram Bot


require("./update")();

app.listen(port);
