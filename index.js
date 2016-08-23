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

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

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

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    //var clients = io.sockets.clients();
    //console.log('haha',clients.server.nsps);
    //console.log(socket.username);
    // we tell the client to execute 'new message'
    console.log(data);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
