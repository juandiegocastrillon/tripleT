'use strict';

// App level module 
angular.module('tripleT', [
  'ngResource',
  'ngRoute',
  'tripleT.dashboard',
  'tripleT.election',
  'tripleT.userManagement',
  'tripleT.layout'
])

.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
})

.run(function($rootScope, $timeout, $http, $location, AuthService) {
  // load front end javascript on all loaded content
  $rootScope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      componentHandler.upgradeAllRegistered();
    }, 500)
  });

  $rootScope.$on('$routeChangeStart', function(event) {
    if (!$rootScope.currentUser) {
      $http.get('/users/me')
      .then(function(res) {
        var user = res.data;
        $rootScope.setCurrentUser(user);
      }, function(res) {
        $location.path('/signin');
        if (!AuthService.isLoggedIn()) {
          console.log('DENY');
          $location.path('/signin');
        }
      });
    }
  });

})

.factory('AuthService', function($http, $rootScope) {
  var authService = {};

  authService.login = function(credentials) {
    return $http.post('/auth/signin', credentials)
    .then(function(res) {
      return res.data;
    });
  };

  authService.isLoggedIn = function() {
    return !!$rootScope.currentUser;
  };

  return authService;
})

.constant("USER_ROLES", {
  admin: 'admin'
})

.controller("AppCtrl", function($scope, $rootScope, $location, USER_ROLES, AuthService) {

  // store current logged in user
  $scope.userRoles = USER_ROLES;

  $rootScope.setCurrentUser = function(user) {
    $rootScope.currentUser = user;
  };
});