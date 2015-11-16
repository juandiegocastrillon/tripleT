angular.module('tripleT.layout', [])
.directive('ttlayout', function() {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    templateUrl: '/angular/layout/layout.html',
    controller: 'LayoutCtrl'
  }
})
.controller('LayoutCtrl',
  function($scope, $location, $http, $window, $anchorScroll) {
    $scope.jumpTo = function(idTag) {
      $location.hash(idTag);
      $anchorScroll();
    }

    $scope.redirect = function(url) {
      $location.path(url);
    }

    $scope.signOut = function() {
      $http.get('/auth/signOut')
        .then(function() {
          $location.path('/signin');
          $window.location.reload();
        });
    }
  });