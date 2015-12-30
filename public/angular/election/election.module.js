angular.module('tripleT.dashboard')
.controller('newElectionCtrl',
  function($scope, Elections, $location, $timeout, $mdDialog) {
    $scope.election = {numWinners: 1};
    $scope.createElection = function() {
      console.log($scope.election.numWinners);
      $scope.election.candidates = $scope.election.candidates.split('\n');
      Elections.save({}, $scope.election,
        function() {
          $location.path('/#/');
          $mdDialog.hide();
        }, function() {
          console.log("Vote didn't submit");
        })
    }
  })

.controller('electionCtrl',
  function($scope, election, Election, kerberos) {
    $scope.election = election;
    $scope.showSubmitText = false;
    $scope.animated = false;

    $scope.submitVote = function() {
      var vote = [];
      var voteElements = angular.element(".election-candidate-name");
      angular.forEach(voteElements, function(voteElement) {
        vote.push(voteElement.innerHTML);
      });

      Election.save({electionID: election._id}, {voter: kerberos, vote: vote}, 
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