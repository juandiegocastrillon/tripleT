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
  function($scope, $location, $anchorScroll, AuthService) {
    $scope.user = AuthService.user;
    $scope.jumpTo = function(idTag) {
      $location.hash(idTag);
      $anchorScroll();
    }

  });