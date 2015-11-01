angular.module('tripleT.dashboard', ['ngResource', 'ngRoute', 'ui.sortable'])
.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/angular/home/dashboard.html',
    controller: 'HomeCtrl'
  });
})

.controller('HomeCtrl',
  function($scope, $location, $http, $timeout, $mdDialog, Elections, Election, Dining, dateFilter, Pm) {
    /*******************************
     ************ ELECTIONS ********
     *******************************/
    Elections.query({}, function(elections) {
      $scope.elections = _.takeRight(elections,10);
    }, function(err) {
      console.log(err);
    });

    $scope.redirect = function(route) {
      console.log(route);
      $location.path(route);
    }

    $scope.getWinner = function(ev, election) {
      $http.get('/voting/' + election._id + '/results')
      .success(function(winner) {
        election.winner = winner ? winner : 'No current votes';
        showWinner(ev, election.winner);
      })
      .error(function(err) {
        console.log(err);
      })
    }

    function showWinner(ev, winner) {
      $mdDialog.show({
        template:
          '<md-dialog>' +
          ' <md-dialog-content>' +
              winner +
          ' </md-dialog- content>' +
          '</md-dialog>',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
      });
    }

    $scope.deleteElection = function(election) {
      Election.delete({electionID: election._id},
        function() {
          _.pull($scope.elections, election);
          console.log("Success");
      })
    }

    $scope.voteInElection = function(ev, electionID) {
      $mdDialog.show({
        controller: 'electionCtrl',
        templateUrl: '/angular/election/election-view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        locals: {
          kerberos: $scope.currentUser.kerberos
        },
        resolve: {
          election: function($q, $route, Election) {
            var defer = $q.defer();

            Election.get({electionID: electionID}, function(election) {
              defer.resolve(election);
            }, function(err) {
              defer.reject(err);
            });

            return defer.promise;
          }
        }
      })
    };

    $scope.newElection = function(ev) {
      $mdDialog.show({
        controller: 'newElectionCtrl',
        templateUrl: '/angular/election/new-election-view.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
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

    $scope.toggleDiningEditMode = function() {
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

    // PM REQUESTS
    //set variables
    $scope.pmEditMode = true;

    $scope.togglePmEditMode = function() {
      $scope.pmEditMode = !$scope.pmEditMode;
    }

    var pmReqID;
    $http.get('/pm').success(function(pmReqID) {
        pmReqID = pmReqID._id;
        console.log('got the id!!');
    });

    function getPmRequests() {
      Pm.get({}, function(pmRequests) {
        $scope.pmRequests = pmRequests.requests;
        $scope.hasPmRequests = ($scope.pmRequests.length != 0);
      });
    }

    getPmRequests();

    $scope.makeRequest = function(pmRequest) {
      if (!pmRequest) return;
      var newReq = {
        author: $scope.currentUser.name,
        item: pmRequest.item,
        reason: pmRequest.reason,
      }
      Pm.save(newReq, function(res){
        $scope.pmRequests.push(newReq);
        $scope.hasPmRequests = true;
      });
    }

    $scope.pmRequestsToDelete = [];
    $scope.toggleDeletePmRequest = function(pmRequest, permitted) {
      if (!permitted) return;
      if ($scope.pmRequestsToDelete.indexOf(pmRequest) > -1)
        _.pull($scope.pmRequestsToDelete, pmRequest);
      else
        $scope.pmRequestsToDelete.push(pmRequest);
    }

    $scope.toggleDeleteAllPmRequests = function() {
      if ($scope.pmRequestsToDelete.length === $scope.pmRequests.length) {
        $scope.pmRequestsToDelete = [];
      }
      else {
        _.forEach($scope.pmRequests, function(pmRequest) {
          if ($scope.pmRequestsToDelete.indexOf(pmRequest) === -1) {
            $scope.pmRequestsToDelete.push(pmRequest);
          }
        });
      }
    }

    $scope.anyPmRequestSelected = function() {
      return $scope.pmRequestsToDelete.length != 0;
    }

    $scope.isToBeDeleted = function(request) {
      return $scope.pmRequestsToDelete.indexOf(request) != -1;
    }

    $scope.removeSelectedPmRequests = function() {
      console.log($scope.pmRequestsToDelete.length);
      reqsToDelete = [];
      _.forEach($scope.pmRequestsToDelete, function(pmRequest) {
        reqsToDelete.push({
          author: pmRequest.author,
          item:   pmRequest.item,
        });
      });
      Pm.delete({'pmRequests': JSON.stringify(reqsToDelete)}, function(res){});
      getPmRequests();
      $scope.pmRequestsToDelete = [];
    }
   })

.factory('Dining', function($resource) {
  return $resource('dining/:diningID', null,
    {
      'update': {method: 'PUT'}
    });
})

.factory('Pm', function($resource) {
  return $resource('pm/', null);
})
