'use strict';

angular.module('angular.home', ['ngRoute'])
.config(function($routeProvider) {
   $routeProvider.when('/', {
      templateUrl: '/angular/home/home.html',
      controller: 'HomeCtrl'
   })
})

.controller('HomeCtrl',
   function($scope) {
      $scope.name = 'tripleT';
   })