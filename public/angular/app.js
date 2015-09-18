'use strict';

// App level module 
angular.module('tripleT', [
  'ngResource',
  'ngRoute',
  'ngMaterial',
  'tripleT.dashboard',
  'tripleT.userManagement',
  'tripleT.layout'
])

.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
})

.run(function($rootScope, $timeout, $http, $location, AuthService) {
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
    });
  };

  authService.isLoggedIn = function() {
    return !!$rootScope.currentUser;
  };

  authService.isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isLoggedIn() &&
      authorizedRoles.indexOf($rootScope.currentUser.role) !== -1);
  }

  return authService;
})

.constant("USER_ROLES", {
  admin: 'admin'
})

.controller("AppCtrl", function($scope, $rootScope, $location, USER_ROLES, AuthService) {
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
  $rootScope.setCurrentUser = function(user) {
    $rootScope.currentUser = user;
  };
});