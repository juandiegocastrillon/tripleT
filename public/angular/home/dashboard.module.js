angular.module('tripleT.dashboard', ['ngResource', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/angular/home/dashboard.html',
    controller: 'HomeCtrl'
  });
})

.controller('HomeCtrl',
  function($scope, $location, $http, $timeout, Elections, Dining, Pm, AuthService) {
    // ELECTION
    Elections.query({}, function(elections) {
      $scope.elections = _.takeRight(elections,10);
    }, function(err) {
      console.log(err);
    });

    $scope.redirect = function(route) {
      $location.path(route);
    }

    $scope.getWinner = function(election) {
      $http.get('/voting/' + election._id + '/results')
      .success(function(winner) {
        election.winner = winner;
        election.show = true;
      })
      .error(function(err) {
        console.log(err);
      })
    }

    // DINING
    $scope.diningEditMode = false;
    var diningID;
    $http.get('/dining').success(function(week) {
      diningID = week._id;
    });

    $scope.hasLatePlate = {};
    Dining.get({diningID: diningID}, function(week) {
      $scope.diningWeek = {};
      $scope.diningWeek.Sunday = week.Sunday;
      $scope.diningWeek.Monday = week.Monday;
      $scope.diningWeek.Tuesday = week.Tuesday;
      $scope.diningWeek.Wednesday = week.Wednesday;
      $scope.diningWeek.Thursday = week.Thursday;

      _.forEach($scope.diningWeek, function(dayInfo, dayofweek) {
        $scope.hasLatePlate[dayofweek] =
          _.includes(dayInfo.latePlates, AuthService.user.kerberos);
      });
    }, function(err) {
      console.log(err);
    });

    $scope.toggleEditMode = function() {
      $scope.diningEditMode = !$scope.diningEditMode;
    }

    $scope.submitDiningMenu = function() {
      Dining.update({diningID: diningID}, {updatedWeek: $scope.diningWeek},
        function(week) {
          console.log(week);
          $scope.diningWeek = week;
          $scope.toggleEditMode();
        });
    }

    $scope.clearLatePlates = function() {
      _.forEach($scope.diningWeek, function(dayInfo, dayofweek) {
        $scope.diningWeek[dayofweek].latePlates = [];
      })
    }

    $scope.addLatePlate = function(dayofweek) {
      $http.put('/dining/' + diningID + '/latePlate/add',
        { dayofweek: dayofweek })
        .success(function(week) {
          $scope.diningWeek[dayofweek].latePlates.push(AuthService.user.kerberos);
          $scope.hasLatePlate[dayofweek] = true;
        })
        .error(function(err) {
          console.error(err);
        })
    }

    $scope.removeLatePlate = function(dayofweek) {
      $http.put('/dining/' + diningID + '/latePlate/remove',
        { dayofweek: dayofweek })
        .success(function(week) {
          _.pull($scope.diningWeek[dayofweek].latePlates, AuthService.user.kerberos);
          $scope.hasLatePlate[dayofweek] = false;
        })
        .error(function(err) {
          console.error(err);
        })
    }

    // PM REQUESTS
    var pmReqID;
    $http.get('/pm').success(function(pmReqID) {
        pmReqID = pmReqID._id;
        console.log('got the id!!');
    });

  //   var pmRequests = {};
  //   Pm.get({pmID: pmID}, function(requests) {
  //     pmRequests = requests;
  //   });
   })

.factory('Dining', function($resource) {
  return $resource('dining/:diningID', null,
    {
      'update': {method: 'PUT'}
    });
})

.factory('Pm', function($resource) {
  return $resource('pm/:pmID', null);
})
