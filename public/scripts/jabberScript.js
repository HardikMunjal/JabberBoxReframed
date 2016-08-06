var app = angular.module('myJabberApp',  []);
app.controller('jabberCtrl', function($scope, $http, $sce ,$timeout) {


    $scope.showImage=false;

     $scope.reset = function() {
        console.log($scope.user);
    };

    $scope.thumbnail = {
        dataUrl: 'adsfas'
    };
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function(files){
        if (files != null) {
            var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                 
                 $timeout(function(){
                 $scope.thumbnail.dataUrl = e.target.result;
                 $scope.showImage=true;
                                    });
                                }
                            });
                        }
                    }
                    };
                });
