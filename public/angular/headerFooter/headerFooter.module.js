angular.module('tripleT.header-footer', [])
.directive('ttheader', function() {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    templateUrl: '/angular/headerFooter/header.html',
    controller: 'HeaderCtrl'
  }
})
.controller('HeaderCtrl',
  function($scope, $location, $anchorScroll, AuthService) {
    $scope.user = AuthService.user;
    $scope.jumpTo = function(idTag) {
      $location.hash(idTag);
      $anchorScroll();
    }

  })
.directive('ttfooter', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: '/angular/headerFooter/footer.html'
  }
});