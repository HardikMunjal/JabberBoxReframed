var app = angular.module('myJabberProfileApp',   ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
 
app.controller('jabberProfileCtrl', function($scope, $http, $sce ,$timeout ,$uibModal, $log ,$rootScope) {
var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 900; // ms
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
$scope.test="true";
$scope.notification=0;
$scope.group_id=null;
$scope.friend_id=null;

$scope.notificationPopupArray=[]; 
 
// dummy personal details and friendsDetails which should i take from api
// $scope.myDetails = {user_id:01, username:"hardi", role:["admin"], email:"hardik.munjal@gmail.com", group:[{id:1,name:'Gladiator'},{id:2,name:'Drakulaaz'}]}
// $scope.friendDetails = [{user_id:"2", username:"riddhi", email:"riddhi.basnal@gmail.com"},{user_id:03, username:"avinash", email:"avinash.bansal@gmail.com"},{user_id:"02", username:"shivi", email:"shivika.bhandari@gmail.com"},{user_id:"04", username:"lovy", email:"lovy.basnal@gmail.com"}]
// $scope.my_id = $scope.myDetails.user_id;

$scope.friendDetails=[];
 
 
var $ctrl = this;
$ctrl.items = ['item1', 'item2', 'item3'];
$ctrl.animationsEnabled = true;
//$ctrl.friends = $scope.friendDetails;
var username;
var connected = true;
var typing = false;
var lastTypingTime;
$scope.typingMessageArray=[];
$scope.typingMessageText='';
$scope.chatMessagesArray =[];
$scope.chatMsg = {};
$scope.chatHeaderMessage="Welcome to jabber box,Now enjoy chat with jabber";
username = localStorage.getItem('username');
//username = 'hardi';
 
document.getElementById("inputMessage").disabled = true;
 
$http({
        method : "GET",
        url : "userDetailApi",
        params: {username: username}
    }).then(function mySucces(response) {
        $scope.myDetails = response.data;
        $scope.my_id = $scope.myDetails.user_id;
        $scope.my_username = $scope.myDetails.username;
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
 
$http({
        method : "GET",
        url : "allFriendsDetailsApi",
        params: {username: username}
    }).then(function mySucces(response) {
        $scope.friendDetails = response.data;

        for(i=0;i<$scope.friendDetails.length;i++){
          $scope.friendDetails[i].count = 0;
        }

    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
 
//$scope.FriendDetails= $scope.friendDetails;
var socket = io();
 
loginUserToSocket();
$scope.open = function(){
  //console.log('bc');
   var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      resolve: {
        items: function () {
          return $ctrl.items;
        },
        friends :function () {
          return $scope.friendDetails;
        },
        user_id :function () {
          return $scope.my_id ;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
}
$scope.fetchPersonalChat = function(friend_id,friend_name){
  //console.log('friend_id',friend_id);
  document.getElementById("inputMessage").disabled = false;
  document.getElementById("inputMessage").focus();
  
  $scope.friend_id = friend_id;
  $scope.friend_name = friend_name;
  $scope.group_id=null;
  $scope.chatMessagesArray =[];
  $scope.chatHeaderMessage="Displaying chat between you and "+$scope.friend_name;

   for(i=0;i<$scope.friendDetails.length;i++){
      if($scope.friend_name ==$scope.friendDetails[i].username){
        $scope.friendDetails[i].count=0;
      }
    }
 
  $http({
        method : "GET",
        url : "fetchPersonalChatsApi",
        params: { user_id: $scope.my_id,
                  friend_id: $scope.friend_id }
    }).then(function mySucces(response) {
        $scope.myWelcome = response.data;
        
         for(i=0;i<response.data.length;i++){
           addChatMessage({
            username: response.data[i].from_username,
            message: response.data[i].message,
            type:'user'
         });
         }
        
 
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
}



$scope.fetchGroupChat = function(group_id,group_name){
  //console.log('friend_id',friend_id);
  document.getElementById("inputMessage").disabled = false;
  document.getElementById("inputMessage").focus();
  
  $scope.group_id = group_id;
  $scope.group_name = group_name;
  $scope.friend_id=null;
  $scope.chatMessagesArray =[];
  $scope.chatHeaderMessage="Displaying chat of group  "+$scope.group_name+ " joined by you" ;
  $scope.room = group_name;

  socket.emit('room', $scope.room);
 
  $http({
        method : "GET",
        url : "fetchGroupChatApi",
        params: { group_id: $scope.group_id }
    }).then(function mySucces(response) {
        $scope.myWelcome = response.data;
        
         for(i=0;i<response.data.length;i++){
           addChatMessage({
            username: response.data[i].from_username,
            message: response.data[i].message,
            room: $scope.group_name,
            type:'group'
         });
         }
        
 
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });


    
}

function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }
  // Log a message
  function log (message, options) {
    //var $el = $('<li>').addClass('log').text(message);
    //addMessageElement($el, options);
    // var log=[];
    // log.push(message);
  }
function loginUserToSocket () {
   
    //username = localStorage.getItem('usernameObject');
  
    if (username) {
    
      // Tell the server your username
      socket.emit('add user', username);
    }
  }
// Sends a chat message
  function sendMessage () {
    //var message = $inputMessage.val();
    //console.log('input message',$scope.inputMsg);
    //var message ="bhai";
    // Prevent markup from being injected into the message
   // message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    //console.log(message);
    if ($scope.inputMsg && connected) {
      //$inputMessage.val('');

      //will work only in user personal chatting, no use in case of group

      if($scope.friend_id){
        addChatMessage({
          username: username,
          message: $scope.inputMsg,
          type:'user'
        });
      }
      // tell server to execute 'new message' and send along one parameter
      $scope.inputChatMessage={};
      $scope.inputChatMessage.from_user=$scope.my_id;
      $scope.inputChatMessage.message=$scope.inputMsg;

      if($scope.group_id){
      $scope.inputChatMessage.group_id=$scope.group_id;
      $scope.inputChatMessage.room=$scope.group_name;
      }
      else{
      $scope.inputChatMessage.to_user=$scope.friend_id;
      $scope.inputChatMessage.friend_name=$scope.friend_name;
      }
      
      socket.emit('new message', $scope.inputChatMessage);
      $scope.inputMsg="";

    }
  }
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    console.log('data coming from server',data);

    for(i=0;i<$scope.friendDetails.length;i++){
      if($scope.friendDetails[i].username==data.username && (data.username != $scope.friend_name)){
        $scope.friendDetails[i].count= $scope.friendDetails[i].count+1;
      }
      if($scope.friend_name && ($scope.friend_name==$scope.friendDetails[i].username)){
        $scope.friendDetails[i].count=0;
      }
    }
    console.log($scope.friendDetails);
    addChatMessage(data);
  });


  socket.on('login onlineuserlist', function (data) {
    $scope.onlineUserArray= data.onlineUsers;

    console.log('user logoin',data);

    console.log('length',$scope.friendDetails.length)
    for(i=0; i< $scope.friendDetails.length; i++){
      if($scope.onlineUserArray.indexOf($scope.friendDetails[i].username)>-1){
        $scope.friendDetails[i].online= true
      }
      else{
        $scope.friendDetails[i].online= false
      }
    }
    if(!$scope.$$phase) {
     //$digest or $apply
     $scope.$apply(function() {
      //$scope.chatMessagesArray = $scope.chatMessagesArray;
     });
     }

  });


  socket.on('user joined', function (data) {
    var newUser = data.username;
    console.log('another user logoin',data);
    for(i=0; i<$scope.friendDetails.length; i++){
        if(newUser == $scope.friendDetails[i].username){
           $scope.friendDetails[i].online= true
       }
      }

      var message = newUser+ "has just joined the jabber";

      $scope.notificationPopupArray.push(message);
      console.log($scope.friendDetails);


      if(!$scope.$$phase) {
       //$digest or $apply
       $scope.$apply(function() {
        //$scope.chatMessagesArray = $scope.chatMessagesArray;
       });
     }

  });


  socket.on('user left', function (data) {
    var leftUser = data.username;
    console.log('another user logout',data);
    for(i=0; i<$scope.friendDetails.length; i++){
        if(leftUser == $scope.friendDetails[i].username){
           $scope.friendDetails[i].online= false
       }
      }

      var message = leftUser+ "has just left the jabber";

      $scope.notificationPopupArray.push(message);

      if(!$scope.$$phase) {
       //$digest or $apply
       $scope.$apply(function() {
        //$scope.chatMessagesArray = $scope.chatMessagesArray;
       });
     }

  });
 
 
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    //chatMsg.from = data.username;
    $scope.chatMessagesArray.push(data);
    
    if(!$scope.$$phase) {
     //$digest or $apply

     $scope.$apply(function() {
      //$scope.chatMessagesArray = $scope.chatMessagesArray;

     });



     }

     
    setTimeout(function(){ 
     var chatArea = document.getElementById("chatArea");
     
     chatArea.scrollTop = chatArea.scrollHeight;

     }, 200);
    

   
    //console.log('data coming from server');
    //console.log(data);
  }



 $scope.filterById = function(message) {


      if($scope.friend_id){
        //console.log('me name',message.username);
        return (  ((message.username == $scope.friend_name) && message.type == 'user') || ((message.username == $scope.my_username) && message.type == 'user') );
      }
      else{
         //console.log('group name',message.username);
        return ((message.room == $scope.group_name) && message.type == 'group');
      }
    };

//this would be the main function which will execute on some keyboard event
$scope.fn = function (event) {
   
    $scope.keyCode = event.keyCode;
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
     document.getElementById("inputMessage").focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.keyCode === 13) {
      if (username) {
        sendMessage();
        //socket.emit('stop typing');
        //typing = false;
      }
    }
}
 
 
// Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });


  // Updates the typing event
  $scope.updateTyping= function() {
    console.log('someone is typing');


    if (connected) {
      if (!typing) {
        typing = true;
        $scope.recieptent={};
        if($scope.friend_name){
          $scope.recieptent.friend_name= $scope.friend_name;
        }
        else{
          $scope.recieptent.roomname= $scope.group_name;
        }
        socket.emit('typing',$scope.recieptent);
      }
      lastTypingTime = (new Date()).getTime();
      console.log('recieptent',$scope.recieptent);
      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing',$scope.recieptent);
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }


  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
  

    if($scope.friend_name && ($scope.friend_name==data.username)){

      $scope.typingMessageText = data.username + " is typing";
      console.log($scope.typingMessageText);



      

    }else if($scope.group_name && ($scope.group_name==data.name)){

      $scope.typingMessageText = data.username + " is typing";
      console.log($scope.typingMessageText);

    }

    if(!$scope.$$phase) {
     //$digest or $apply

     $scope.$apply(function() {
      //$scope.chatMessagesArray = $scope.chatMessagesArray;

     });



     }


  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    $scope.typingMessageText = "";
    console.log('msg text null');
    if(!$scope.$$phase) {
     //$digest or $apply

     $scope.$apply(function() {
      //$scope.chatMessagesArray = $scope.chatMessagesArray;

     });



     }

  });
 
});
 
 
 
app.controller('ModalInstanceCtrl', function ($uibModalInstance, items ,friends,user_id,$scope ,$http) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };
  $ctrl.friends = friends;

 
  $ctrl.ok = function () {
 
   $scope.data.user_id= user_id;
   
   $scope.data.userArray.push(user_id);
 
  $http({
    url: "http://localhost:3000/createGroupApi",
    method: "POST",
    data: $scope.data
   }).then(function mySucces(response) {
          
          // window.confirm(response.data);
      }, function myError(response) {
          $scope.myWelcome = response.statusText;
      });
 
    $uibModalInstance.close($ctrl.selected.item);
  };
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});