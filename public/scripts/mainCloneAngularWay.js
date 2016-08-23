var app = angular.module('myJabberProfileApp',   ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
 
app.controller('jabberProfileCtrl', function($scope, $http, $sce ,$timeout ,$uibModal, $log) {
 
var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 400; // ms
var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
$scope.test="true";
 
 
var $ctrl = this;
  $ctrl.items = ['item1', 'item2', 'item3'];
 
  $ctrl.animationsEnabled = true;
 
 
 
// dummy personal details and friendsDetails which should i take from api
$scope.myDetails = {user_id:"01", username:"hardi", role:["admin"], email:"hardik.munjal@gmail.com", group:[{id:1,name:'Gladiator'},{id:2,name:'Drakulaaz'}]}
$scope.friendDetails = [{user_id:"01", username:"riddhi", email:"riddhi.basnal@gmail.com"},{user_id:"03", username:"avinash", email:"avinash.bansal@gmail.com"},{user_id:"02", username:"shivi", email:"shivika.bhandari@gmail.com"},{user_id:"04", username:"lovy", email:"lovy.basnal@gmail.com"}]
$scope.my_id = $scope.myDetails.user_id;
 
var username;
var connected = true;
var typing = false;
var lastTypingTime;
$scope.chatMessagesArray =[];
$scope.chatMsg = {};
 
username = localStorage.getItem('usernameObject');
 
document.getElementById("inputMessage").focus();
 
 
var socket = io();
 
$scope.open = function(){
  console.log('bc');
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
        }
      }
    });
 
    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
}
 
$scope.fetchPersonalChat = function(user_id){
console.log('friend_id',user_id);

$http.get("localhost:4000/fetchChat?my_id="+$scope.my_id+"&user_id="+user_id)
    .then(function(response) {
        $scope.myWelcome = response.data;
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
 
function setUsername () {
    //username = cleanInput($usernameInput.val().trim());
    username = localStorage.getItem('usernameObject');
    console.log(username);
    
    // If the username is valid
    if (username) {
      //$loginPage.fadeOut();
      // $chatPage.show();
      //  $loginPage.off('click');
      //$currentInput = $inputMessage.focus();
 
      // Tell the server your username
      socket.emit('add user', username);
    }
  }
 
// Sends a chat message
  function sendMessage () {
    //var message = $inputMessage.val();
    console.log('input message',$scope.inputMsg);
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
      socket.emit('new message', $scope.inputMsg);
    }
  }
 
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });
 
 
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
 
    //chatMsg.from = data.username;
    $scope.chatMessagesArray.push(data);
    console.log('data coming from server');
    console.log(data);
  }
 
// <input ng-keydown=fn($event)><br>
//   $event.keyCode={{keyCode}}
 
// $scope.fn = function (event) {
//     console.log(event);
//     $scope.keyCode = event.keyCode;
// }
 
 
 
//this would be the main function which will execute on some keyboard event
$scope.fn = function (event) {
    //console.log(event);
    console.log(event.keyCode);
    $scope.keyCode = event.keyCode;
    // debugger;
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
     // $currentInput.focus();
     document.getElementById("inputMessage").focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.keyCode === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
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
 
 
// $window.keydown(function (event) {
//     // Auto-focus the current input when a key is typed
//     if (!(event.ctrlKey || event.metaKey || event.altKey)) {
//       $currentInput.focus();
//     }
//     // When the client hits ENTER on their keyboard
//     if (event.which === 13) {
//       if (username) {
//         sendMessage();
//         socket.emit('stop typing');
//         typing = false;
//       } else {
//         setUsername();
//       }
//     }
//   });
 
 
  
});
 
 
 
 
app.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };
 
  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };
 
  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
 