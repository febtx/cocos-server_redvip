
// server.js
const express    = require("express");
const app        = express();
const port       = process.env.PORT || 80;
const expressWs  = require('express-ws')(app);
const bodyParser = require("body-parser");

// const helmetCSP = require('helmet-csp');

/**
app.use(helmetCSP({
	directives: {
	    connectSrc: ["'self'", "ws://127.0.0.1/*"]
	}
}));
*/

//const Ddos = require("ddos")
//const ddos = new Ddos({burst:10, limit:15})
//app.use(ddos.express);

//const path  = require("path");
//const flash = require("connect-flash");

//const cookieParser = require("cookie-parser");
//const session      = require("express-session");


// Setting & Connect to the Database
const configDB = require("./config/database");
const mongoose = require("mongoose");

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
var redT = expressWs.getWss();

require('./app/Helpers/socketUser')(redT); // Add function socket

redT.users  = []; // danh sách người dùng đăng nhập
redT.admins = []; // danh sách admin đăng nhập

require('./routerHttp')(app, redT);   // load các routes HTTP
require('./routerSocket')(app, redT); // load các routes WebSocket

require("./app/Cron/taixiu")(redT);   // Chạy game Tài Xỉu
require("./app/Cron/baucua")(redT);   // Chạy game Bầu Cua

require("./config/cron")();

app.listen(port);
