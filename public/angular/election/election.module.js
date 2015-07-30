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