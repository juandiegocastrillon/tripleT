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

  $routeProvider.when('/changePassword', {
    templateUrl: '/angular/userManagement/changePassword.html',
    controller: 'ChangePwdCtrl'
  });
})

.controller('SignInCtrl',
  function($scope, $location, AuthService, $window){
    $scope.signIn = function(credentials) {
      AuthService.login(credentials)
      .then(function(user) {
        $scope.setCurrentUser(user);
        $location.path('/');
      }, function() {
        $scope.errorMsg = "Incorrect kerberos or password"
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

.controller('ChangePwdCtrl', 
  function($scope, $http, $timeout) {
    // userInput = {
    //    password: their current password
    //    newPassword: what they want it to be
    //    confirmNewPassword: above. hopefully.   
    //  }
    $scope.changePassword = function(userInput) {
      $scope.passwordChanged = false;
      $scope.errorMsg = null;
      if (userInput.newPassword != userInput.confirmNewPassword)
        $scope.errorMsg = 'New passwords entered do not match';
      else {
        $http.post('/auth/changePassword',{
          'kerberos': $scope.currentUser.kerberos,
          'password': userInput.password,
          'newPassword': userInput.newPassword
        })
        .then(function(res) {
          $scope.passwordChanged = true;
          $scope.animated = true;
          $timeout(function() {
            $scope.passwordChanged = false;
          }, 3000);
        }, function(err) {
          $scope.errorMsg = err.data.message;
        })
      }
    }
})

.controller('NewUserCtrl', 
  function($scope, $http, $mdDialog) {
    $scope.createNewUser = function(newUser) {
      $http.post('/auth/signUp', newUser).then(function(res) {
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