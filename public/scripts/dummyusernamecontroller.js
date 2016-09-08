angular.module('dummyApp', [])
.controller('dummyCtrl',['$scope','$window',function($scope,$window){
 $scope.fn = function (event) {
    
    
    // When the client hits ENTER on their keyboard
    if (event.keyCode === 13) {
      if ($scope.username) {
        localStorage.setItem('username', $scope.username);
      }
     window.location = "http://192.168.1.4:3000/"; 
    }
}  


}]);