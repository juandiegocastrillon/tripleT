angular.module('tripleT.userManagement', ['ngRoute', 'ngMessages'])
.config(function($routeProvider) {
  $routeProvider.when('/signin', {
    templateUrl: '/angular/home/signin.html',
    controller: 'SignInCtrl'
  });

  $routeProvider.when('/userManagement', {
    templateUrl: '/angular/home/userManagement.html',
    controller: 'UserMgmtCtrl'
  });
})

.controller('SignInCtrl',
  function($scope, $location, AuthService, $window){
    $scope.signin = function(credentials) {
      AuthService.login(credentials)
      .then(function(user) {
        $scope.setCurrentUser(user);
        $location.path('/');
      })
    }
  })

.controller('UserMgmtCtrl',
  function($scope, $http, $mdDialog) {
    $scope.allRoles = Object.keys($scope.userRoles);

    $scope.getUsers = function() {
      $http.get('/users')
        .then(function(res) {
          $scope.users = _.sortBy(res.data, 'displayName');
        })      
    }

    $scope.getUsers();

    $scope.changePermission = function(userID, newRole) {
      if (newRole && userID) {
        $http.post('/users/' + userID + '/changePermission', {
          'newRole' : newRole
        })
      }
    }

    $scope.newUserModal = function(ev) {
      $mdDialog.show({
        controller: 'NewUserCtrl',
        templateUrl: '/angular/userManagement/new-user.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true
      })
    }

    $scope.removeUserModal = function(ev, user) {
      $mdDialog.show({
        controller: 'RemoveUserCtrl',
        templateUrl: '/angular/userManagement/remove-user.html',
        parent: angular.element(document.body),
        locals: {user: user},
        targetEvent: ev,
        clickOutsideToClose: true,
        scope: $scope,
        preserveScope: true
      })
    }
})

.controller('NewUserCtrl', 
  function($scope, $http, $mdDialog) {
    $scope.createNewUser = function(newUser) {
      $http.post('/auth/signup', newUser).then(function(res) {
        var user = res.data;
        $scope.users.push(user);
        $mdDialog.hide();
      }, function(err) {
        $scope.errorMsg = err.data.message;
        $mdDialog.cancel();
      })
    }
})

.controller('RemoveUserCtrl',
  function($scope, $http, $mdDialog, user) {
    $scope.user = user;

    $scope.removeUser = function(userID) {
      $http.delete('/users/' + userID);
      $mdDialog.hide();
      $scope.getUsers();
    }

    $scope.cancel = function() {
      $mdDialog.hide();
    }
  })