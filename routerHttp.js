
// Router HTTP / HTTPS

const mobile = require('is-mobile');

module.exports = function(app) {
	// Home
	app.get('/', function(req, res) {
		if (mobile({ua:req}))
			res.redirect('/mobile/');
		else
			res.redirect('/web/');
	});
	app.get('/web/', function(req, res) {
		if (mobile({ua:req}))
			res.redirect('/mobile/');
		else
			res.render('index');
	});
	app.get('/mobile/', function(req, res) {
		if (mobile({ua:req}))
			res.render('index_mobile');
		else
			res.redirect('/web/');
	});

	// Admin
	app.get('/jadmin/', function(req, res) {
		//if (mobile({ua:req}))
		//	res.redirect('/admin/mobile/');
		//else
		//	res.redirect('/admin/web/');
		res.render('admin');
	});
	/**
	app.get('/admin/web/', function(req, res) {
		if (mobile({ua:req}))
			res.redirect('/admin/mobile/');
		else
			res.render('admin');
	});
	app.get('/admin/mobile/', function(req, res) {
		if (mobile({ua:req}))
			res.render('admin_mobile');
		else
			res.redirect('/admin/web/');
	});
	*/
};
