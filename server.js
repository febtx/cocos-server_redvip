
// server.js

const express   = require("express");
const app       = express();
const port      = process.env.PORT || 80;
const expressWs = require('express-ws')(app);
const helmetCSP = require('helmet-csp');

app.use(helmetCSP({
	directives: {
	    connectSrc: ["'self'", "ws://127.0.0.1/*"]
	}
}));

//const Ddos = require("ddos")
//const ddos = new Ddos({burst:10, limit:15})
//app.use(ddos.express);

//const path  = require("path");
//const flash = require("connect-flash");

//const cookieParser = require("cookie-parser");
//const bodyParser   = require("body-parser");
//const session      = require("express-session");


// Setting & Connect to the Database
const configDB = require("./config/database");
const mongoose = require("mongoose");

require('mongoose-long')(mongoose);

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex",   true);
mongoose.connect(configDB.url, configDB.options); // kết nối tới database

// config
//require("./config/io")(io); // cấu hình io users
require("./config/admin");  // cấu hình tài khoản admin mặc định và các dữ liệu mặc định


//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

/**
app.use(session({
	secret: "secret",
	saveUninitialized: true,
	resave: true
}));
*/
// Cấu hình ứng dụng express
//app.use(morgan("dev"));  // sử dụng để log mọi request ra console
//app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie
//app.use(bodyParser());   // lấy thông tin từ form HTML
//app.use(flash()); 


app.set("view engine", "ejs"); // chỉ định view engine là ejs
app.set("views", "./views");   // chỉ định thư mục view

// Serve static html, js, css, and image files from the "public" directory
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

var redT = expressWs.getWss();
redT.users  = [];
redT.admins = [];
require('./routerHttp')(app);         // load các routes HTTP
require('./routerSocket')(app, redT); // load các routes WebSocket

require("./app/Cron/taixiu")(redT);   // Chạy game Tài Xỉu
require("./app/Cron/baucua")(redT);   // Chạy game Bầu Cua

//console.log(TT);

//require("./usersIO")(userSocket);
//require("./adminIO")(adminSocket);

app.listen(port);
