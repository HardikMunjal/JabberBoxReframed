var app = angular.module('myJabberProfileApp',   ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
 
app.controller('jabberProfileCtrl', function($scope, $http, $sce ,$timeout ,$uibModal, $log ,$rootScope) {
var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 400; // ms
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
$scope.test="true";
 
// dummy personal details and friendsDetails which should i take from api
// $scope.myDetails = {user_id:01, username:"hardi", role:["admin"], email:"hardik.munjal@gmail.com", group:[{id:1,name:'Gladiator'},{id:2,name:'Drakulaaz'}]}
// $scope.friendDetails = [{user_id:"2", username:"riddhi", email:"riddhi.basnal@gmail.com"},{user_id:03, username:"avinash", email:"avinash.bansal@gmail.com"},{user_id:"02", username:"shivi", email:"shivika.bhandari@gmail.com"},{user_id:"04", username:"lovy", email:"lovy.basnal@gmail.com"}]
// $scope.my_id = $scope.myDetails.user_id;
$scope.friend_id = null;
 
 
var $ctrl = this;
$ctrl.items = ['item1', 'item2', 'item3'];
$ctrl.animationsEnabled = true;
//$ctrl.friends = $scope.friendDetails;
var username;
var connected = true;
var typing = false;
var lastTypingTime;
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
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
 
$http({
        method : "GET",
        url : "allFriendsDetailsApi",
        params: {username: username}
    }).then(function mySucces(response) {
        $scope.friendDetails = response.data;
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
 
$scope.FriendDetails= $scope.friendDetails;
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
  $scope.chatMessagesArray =[];
  $scope.chatHeaderMessage="Displaying chat between you and "+$scope.friend_name;
 
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
            message: response.data[i].message
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
      addChatMessage({
        username: username,
        message: $scope.inputMsg
      });
      // tell server to execute 'new message' and send along one parameter
      $scope.inputChatMessage={};
      $scope.inputChatMessage.from_user=$scope.my_id;
      $scope.inputChatMessage.to_user=$scope.friend_id;
      $scope.inputChatMessage.friend_name=$scope.friend_name;
      $scope.inputChatMessage.message=$scope.inputMsg;
      socket.emit('new message', $scope.inputChatMessage);
    }
  }
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    console.log('data coming from server',data);
    addChatMessage(data);
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
   
    //console.log('data coming from server');
    //console.log(data);
  }
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
        socket.emit('stop typing');
        typing = false;
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
          $scope.friendDetails = response.data;
      }, function myError(response) {
          $scope.myWelcome = response.statusText;
      });
 
    $uibModalInstance.close($ctrl.selected.item);
  };
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});