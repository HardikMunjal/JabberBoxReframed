var userInfo = require('./userInfoController');
var chatInfo = require('./chatStorageController');

module.exports = function (app) {


//this route will open the chat profile page if username exist in the session else it will open the login page
app.get('/', function(req, res, next) {
	res.render('views/jabber.html');
});

app.get('/dummysaveusername', function(req, res, next) {
	res.render('views/dummyuser.html');
});


//this route will check the user credential details from database (with roles) and add some user details to node session
app.get('/login', function(req, res, next) {
	res.render('login.html');
});


app.get('/register', function(req, res, next) {
	res.render('views/register.html');
});


//this will register the details and add some user details to node session
app.post('/registerApi', function(req, res, next) {
	res.render('register.html');
});


//this will delete the user details from node session
app.get('/logoutApi', function(req, res, next) {
});


//this will give the user details and their repective rolesssss
//by default user own details is passed
//but if in parameter user_id is passed, then details of that user_id will be passed
app.get('/userDetailApi',userInfo.getSingleUserDetails);



//this will give the details of all users of same organisation
app.get('/allFriendsDetailsApi', userInfo.getAllFriendsDetails);

app.get('/fetchPersonalChatsApi', chatInfo.fetchPersonalChat);


app.get('/profile', function(req, res, next) {
	res.render('index.html');
});


app.get('/page', function(req, res, next) {
	res.render('userdetail.html');
});
};

