'use strict';

angular.module('tripleT.home')

.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'angular/home/home.html',
    controller: 'HomeCtrl'
  });
})

.controller('HomeCtrl',
   function($scope) {
      $scope.title = 'tripleT';
      $scope.elections = ['one', 'two', 'three'];
   })