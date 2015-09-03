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
  $rootScope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      componentHandler.upgradeAllRegistered();
    }, 500)
  });

  // called in upon every reload in app.js run()
  // Makes GET request to /users/me to get currently signed-in user
  $http.get('/users/me')
    .success(function(res) {
      AuthService.user = res;
    })
    .error(function(response) {
      $location.path('userManagement');
    })
})

.factory('AuthService', function() {
  return {
    user: '',
  }
})

.controller("AppCtrl", function($rootScope, $location) {
  // handle non-existant routes
  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    console.error("failed to change routes");
    $location.path('/');
  });
});