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

  // When a route changes, deny access to route if
  // user isn't authenticated.
  //
  // If there appears to be no current user, ask the server
  // for currently signed-in user. Session gets cleared after
  // page refresh
  $rootScope.$on('$routeChangeStart', function() {
    if (!AuthService.isLoggedIn()) {
      $http.get('/users/me')
      .then(function(res) {
        var user = res.data;
        $rootScope.setCurrentUser(user);
      }, function(res) {
        $location.path('/signin');
        if (!AuthService.isLoggedIn()) {
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
    }, function(res) {
      console.log(res);
    });
  };

  authService.isLoggedIn = function() {
    return !!$rootScope.currentUser;
  };

  return authService;
})

.constant("USER_ROLES", {
  admin: 'admin',
  comm: 'comm',
  pm: 'comm'
})

.controller("AppCtrl", function($scope, $rootScope, $location, USER_ROLES, AuthService) {

  // store current logged in user
  $scope.userRoles = USER_ROLES;

  $rootScope.setCurrentUser = function(user) {
    $rootScope.currentUser = user;
  };
});