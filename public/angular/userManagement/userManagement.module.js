angular.module('tripleT.userManagement', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/userManagement', {
    templateUrl: '/angular/home/signin.html',
    controller: 'SignInCtrl'
  })
})

.controller('SignInCtrl',
  function($scope, $location, $http, $window){
    $scope.signin = function(credentials) {
      $http.post('/auth/signin', credentials)
      .success(function(res) {
        $location.path('/');
        $window.location.reload();
      })
    }
  });