//https://gist.github.com/dskanth/2634239
// Setup basic express server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var router = express.Router();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var chatStorageModel = require('./model/chatStorage');

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
//add body parser thing before router to parse data in req body.
app.use(bodyParser.json({
  limit: '10mb'
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
// app.use(bodyParser.json());

var upload = multer({ dest: './upload/' });

app.post('/upload', upload.single('file'), function (req, res, next) {
   console.log(req.body);
        console.log(req.file);
})
app.use(router);
require('./routes')(router);



// var storage = multer.diskStorage({ //multers disk storage settings
//         destination: function (req, file, cb) {
//             cb(null, './upload/');
//         },
//         filename: function (req, file, cb) {
//             var datetimestamp = Date.now();
//             cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
//         }
// });

// var upload = multer({ //multer settings
//                     storage: storage
//              }).single('file');

/** API path that will upload the files */
// app.post('/upload', function(req, res) {

//        console.log(req.body);
//        console.log(req.file);
//         upload(req,res,function(err){
//             if(err){
//                  res.json({error_code:1,err_desc:err});
//                  return;
//             }
//              res.json({error_code:0,err_desc:null});
//       });
// });

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Chatroom

var numUsers = 0;
var users={};

var loginUserArray=[];

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {


    if(data.to_user){
    
    chatStorageModel.savePersonalChatUser(data, function(err, result) {

    if (err) {
      return next(err);
    }
    console.log('success');
    console.log('socket',socket.username);
   });
 
    users[data.friend_name].emit('new message', {
      username: socket.username,
      message: data.message,
      type:'user'
    });
    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   message: data.message
    // });

   }
   else{

    chatStorageModel.saveGroupChat(data, function(err, result) {

    if (err) {
      return next(err);
    }
    console.log('success');
    console.log('socket',socket.username);
   });
 

    io.sockets.in(data.room).emit('new message', {
      username: socket.username,
      message: data.message,
      room:data.room,
      type:'group'
    });

    // socket.broadcast.emit('new message', {
    //   username: socket.username,
    //   message: data.message,
    //   room:data.room
    // });


   }
  });

  socket.on('room', function(room) {
        socket.join(room);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;

    loginUserArray.push(username);

    users[socket.username]=socket;

    var numUsers = loginUserArray.length;
    addedUser = true;
    socket.emit('login onlineuserlist', {
      onlineUsers: loginUserArray
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: username,
      numUsers: numUsers
    });


  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (recieptent) {

    if(recieptent.roomname){

      io.sockets.in(recieptent.roomname).emit('typing', {
        username: socket.username,
        name: recieptent.roomname,
        type:'group'
      });

    }
    else{
      console.log(recieptent);
      users[recieptent.friend_name].emit('typing', {
        username: socket.username,
        name: recieptent.friend_name,
        type: 'user'
     });
    }
    // socket.broadcast.emit('typing', {
    //   username: socket.username
    // });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function (recieptent) {
    console.log(recieptent);
    if(recieptent.roomname){

      io.sockets.in(recieptent.roomname).emit('stop typing', {
        username: socket.username
      });

    }
    else{
      users[recieptent.friend_name].emit('stop typing', {
        username: socket.username
     });
    }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
      
      console.log('user disc',socket.username);
      var index = loginUserArray.indexOf(socket.username);
      var numUsers = loginUserArray.length;
      if (index > -1) {
        loginUserArray.splice(index, 1);
      }
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers 
      });
  });
});
