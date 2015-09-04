angular.module('tripleT.userManagement', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/signin', {
    templateUrl: '/angular/home/signin.html',
    controller: 'SignInCtrl'
  })
})

.controller('SignInCtrl',
  function($scope, $location, AuthService, $window){
    $scope.signin = function(credentials) {
      AuthService.login(credentials)
      .then(function(user) {
        console.log(user);
        $scope.setCurrentUser(user);
        $location.path('/');
      })
    }
  });