'use strict';

var _ = require('lodash');
var assert = require('assert');

function getWinner(votesFromDB) {
   assert(_.isArray(votesFromDB));
   if (_.isEmpty(votesFromDB)) {
      return '';
   }

   var votes = _.pluck(votesFromDB, 'vote');
   votes = _.clone(votes, true);
   var majority = votes.length / 2;

   while (true) {
      var count = countVotes(votes);
      var min, max;
      _.forEach(count, function(freq, candidate) {
         if (!min || !max) {
            min = {candidate: candidate, freq: freq};
            max = {candidate: candidate, freq: freq};
         }
         if (freq < min.freq) {
            min = {candidate: candidate, freq: freq};
         }
         if (freq > max.freq) {
            max = {candidate: candidate, freq: freq};
         }
      });

      if (max.freq >= majority) {
         return max.candidate;
      }

      votes = removeLoser(votes, min.candidate);   
   }
}

function countVotes(votes) {
   var firstVoteFreq = _.countBy(votes, function(vote) {
      return vote[0];
   })
   return firstVoteFreq;
}

function removeLoser(votes, loser) {
   return _.forEach(votes, function(vote) {
      _.pull(vote, loser);
   })
}

module.exports.getWinner = getWinner;