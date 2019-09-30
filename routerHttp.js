
// Router HTTP / HTTPS
let mobile = require('is-mobile');

module.exports = function(app, redT) {
	// Home
	app.get('/', function(req, res) {
		if (mobile({ua:req})){
			res.redirect('/mobile/');
		} else {
			res.redirect('/web/');
		}
	});
	app.get('/web/', function(req, res) {
		if (mobile({ua:req})){
			res.redirect('/mobile/');
		} else {
			res.render('index');
		}
	});
	app.get('/mobile/', function(req, res) {
		if (mobile({ua:req})){
			res.render('index_mobile');
		} else {
			res.redirect('/web/');
		}
	});

	// Admin
	app.get('/68ClubA/', function(req, res) {
		res.render('admin');
	});

	// Sign API
	require('./routes/api')(app, redT);  // load routes API
};
