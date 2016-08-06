module.exports = function (app) {



app.get('/', function(req, res, next) {
	res.render('login.html');
});


app.get('/profile', function(req, res, next) {
	res.render('index.html');
});


app.get('/page', function(req, res, next) {
	res.render('userdetail.html');
});
};

