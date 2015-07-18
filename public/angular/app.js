'use strict';

// App level module 
angular.module('tripleT', [
  'ngResource',
  'ngRoute',
  'tripleT.home',
  'tripleT.election',
  'tripleT.header-footer'
])

.config(function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
})

.run(function($rootScope, $timeout, $http, AuthService) {
  $rootScope.$on('$viewContentLoaded', function() {
    $timeout(function() {
      componentHandler.upgradeAllRegistered();
    }, 500)
  });

  // called in upon every reload in app.js run()
  // Makes GET request to /users/me to get currently signed-in user
  $http.get('/users/me')
    .success(function(res) {
      AuthService.user = res;
    })
    .error(function(response) {
      console.log("NO USER DETECTED");
    })
})

.factory('AuthService', function() {
  return {
    user: '',
  }
})

.controller("AppCtrl", function($rootScope, $location) {
  // handle non-existant routes
  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    console.error("failed to change routes");
    $location.path('/');
  });
});

angular.module('tripleT.home', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/angular/home/home.html',
    controller: 'HomeCtrl'
  });
})

.controller('HomeCtrl',
   function($scope, $location, $http, $timeout, Elections, Dining, AuthService) {
      Elections.query({}, function(elections) {
        $scope.elections = _.takeRight(elections,10);
      }, function(err) {
        console.log(err);
      });

      // ELECTION
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
      $scope.hasLatePlate = {};
      Dining.get({diningID: '55a5c8375da1b7ab104cec4f'}, function(week) {
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

      $scope.addLatePlate = function(dayofweek) {
        var diningID = '55a5c8375da1b7ab104cec4f';
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
        var diningID = '55a5c8375da1b7ab104cec4f';
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
   })

.factory('Dining', function($resource) {
  return $resource('dining/:diningID');
});


angular.module('tripleT.election', ['ngResource', 'ngRoute', 'ui.sortable'])
.config(function($routeProvider) {
  $routeProvider.when('/election/:electionID', {
    templateUrl: '/angular/election/election-view.html',
    controller: 'ElectionCtrl',
    resolve: {
      election: function($q, $route, Election) {
        var defer = $q.defer();
        var electionID = $route.current.params.electionID;

        Election.get({electionID: electionID}, function(election) {
          defer.resolve(election);
        }, function(err) {
          defer.reject(err);
        });

        return defer.promise;
      }
    }
  })
  .when('/newElection', {
    templateUrl: '/angular/election/new-election-view.html',
    controller: 'newElectionCtrl'
  })
})

.controller('newElectionCtrl',
  function($scope, Elections, $location, $timeout) {
    $scope.createElection = function() {
      $scope.election.candidates = $scope.election.candidates.split('\n');
      Elections.save({}, $scope.election,
        function(election) {
          $location.path('/election/' + election._id);
        }, function() {
          console.log("Vote didn't submit");
        })
    }
  })

.controller('ElectionCtrl',
  function($scope, election, Election) {
    $scope.election = election;
    $scope.showSubmitText = false;
    $scope.animated = false;

    $scope.submitVote = function() {
      var vote = [];
      var voteElements = angular.element(".election-candidate-name");
      angular.forEach(voteElements, function(voteElement) {
        vote.push(voteElement.innerHTML);
      });

      Election.save({electionID: election._id}, {voter: "John", vote: vote}, 
        function() {
          $scope.animated = true;
          $scope.showSubmitText = true;
          setTimeout(function() {
            $scope.$apply(function() {
              $scope.showSubmitText = false;
            });
          }, 5000);
        }, function(err) {
          console.log("Vote couldn't be submitted");
        });
    }
  })

.factory('Elections', function($resource) {
   return $resource('voting/');
})

.factory('Election', function($resource) {
  return $resource('voting/:electionID');
});

angular.module('tripleT.header-footer', [])
.directive('ttheader', function() {
  return {
    restrict: 'E',
    scope: false,
    transclude: true,
    templateUrl: '/angular/home/header.html',
    controller: 'HeaderCtrl'
  }
})
.controller('HeaderCtrl',
  function($scope, $location, $anchorScroll) {
    $scope.jumpTo = function(idTag) {
      $location.hash(idTag);
      $anchorScroll();
    }

  })
.directive('ttfooter', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: '/angular/home/footer.html'
  }
})