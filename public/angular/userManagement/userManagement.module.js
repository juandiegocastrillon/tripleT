angular.module('tripleT.userManagement', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/userManagement', {
    templateUrl: '/angular/home/signin.html',
    controller: 'SignInCtrl'
  })
})

.controller('SignInCtrl',
  function($scope, $location, $http, $window){
    $scope.credentials = {};
    $scope.signin = function() {
      $http.post('/auth/signin', $scope.credentials)
      .success(function(res) {
        $location.path('/');
        $window.location.reload();
      })
    }
  });