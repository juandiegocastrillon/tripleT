angular.module('tripleT.dashboard', ['ngResource', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/angular/home/dashboard.html',
    controller: 'HomeCtrl'
  });
})

.controller('HomeCtrl',
  function($scope, $location, $http, $timeout, $mdDialog, Elections, Dining, dateFilter) {
    /*******************************
     ************ ELECTIONS ********
     *******************************/
    Elections.query({}, function(elections) {
      $scope.elections = _.takeRight(elections,10);
      console.log($scope.elections);
    }, function(err) {
      console.log(err);
    });

    $scope.redirect = function(route) {
      console.log(route);
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

    $scope.voteInElection = function(ev) {
      $mdDialog.show({
        controller: voteElectionCtrl,
        templateUrl: '/angular/election/election-view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        // success
      }, function() {
        // failure
      });
    };

    function voteElectionCtrl($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    /*******************************
     ************ DINING ***********
     *******************************/
    // set variables
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    $scope.abbrevDOW = ["Sun", "Mon", "Tues", "Wed", "Thurs"];
    $scope.diningEditMode = false;
    var diningID;

    // get current dining week ID
    Dining.get({diningID: ''}, function(week) {
      diningID = week._id;
    }, function() {
      // create a new dining week
      Dining.save({diningID: ''}, {}, function(week) {
        diningID = week._id;
      });
    });

    // set dining week
    $scope.hasLatePlate = {};
    Dining.get({diningID: diningID}, function(week) {
      setDiningWeek(week);

      _.forEach($scope.diningWeek, function(dayInfo, dayofweek) {
        $scope.hasLatePlate[dayofweek] =
          _.includes(dayInfo.latePlates, $scope.currentUser.kerberos);
      });
    }, function(err) {
      console.log(err);
    });

    // set the active tab to the current day
    var day = new Date();
    $scope.currentDayOfWeek = $scope.daysOfWeek.indexOf(dateFilter(day, 'EEEE'));

    // if current day is not a school night, display Sunday's menu
    if ( $scope.currentDayOfWeek === -1 ) {
      $scope.currentDayOfWeek = 0;
    }

    $scope.toggleEditMode = function() {
      $scope.diningEditMode = !$scope.diningEditMode;
    }

    $scope.submitDiningMenu = function() {
      Dining.update({diningID: diningID}, {updatedWeek: $scope.diningWeek},
        function(week) {
          setDiningWeek(week);
          $scope.toggleEditMode();
        });
    }

    function setDiningWeek(week) {
      $scope.diningWeek = {};
      _.forEach($scope.daysOfWeek, function(day) {
        $scope.diningWeek[day] = week[day];
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
          $scope.diningWeek[dayofweek].latePlates.push($scope.currentUser.kerberos);
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
          _.pull($scope.diningWeek[dayofweek].latePlates, $scope.currentUser.kerberos);
          $scope.hasLatePlate[dayofweek] = false;
        })
        .error(function(err) {
          console.error(err);
        })
    }
   })

.factory('Dining', function($resource) {
  return $resource('dining/:diningID', null, 
    {
      'update': {method: 'PUT'}
    });
});