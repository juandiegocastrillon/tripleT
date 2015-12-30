'use strict';

var _ = require('lodash');
var assert = require('assert');

/**
 * Classical Election Algorithm
 * This algorithm is used for elections that will have more than one winner
 * such as Senior Council elections or A-comm elections. In this case, instant
 * run off doesn't work because the voters don't have a ranked preference.
 *
 * In this case, the voter's first numWinners candidates are counted and the
 * numWinners candidates with the most votes wins
 * @param votesFromDB: array of votes straight from DB
 * @return winners (array) of winners.
*/
function classicalElection(votesFromDB, numWinners) {
   assert(_.isArray(votesFromDB));
   if (_.isEmpty(votesFromDB)) {
      return '';
   }

   // make a 2D array of all the voter's votes
   var votes = _.pluck(votesFromDB, 'vote');
   // clone so that votes aren't modified on database
   votes = _.clone(votes, true);
   // grab the first numWinners from votes
   votes = _.map(votes, function(candidates) {
      return _.slice(candidates, 0, numWinners);
   });
   votes = _.flatten(votes);

   // count the frequency of votes and sorty by count
   var count = _.countBy(votes);
   var sorted = sortKeysByValue(count);

   // grab the winners from sorted list
   return _.takeRight(sorted, numWinners);
}

/**
 * Instant Run-off Voting Algorithm
 * Each vote is ranked by preference for candidate
 * Algorithm goes through many iterations until a candidate has the 
 * majority (>50%) of votes. Each iteration, the voter's first preferences
 * are taken, counted, and determined who has the most votes (the winner) and 
 * the least votes (the loser). If the winner has the majority of the votes, he
 * is the winner. Otherwise, the loser is removed from every voter's preferences and
 * and another iteration is performed
 *
 * @param votesFromDB: array of votes straight from DB
 * @return winner (string) of winner.
*/
function instantRunOff(votesFromDB) {
   assert(_.isArray(votesFromDB));
   if (_.isEmpty(votesFromDB)) {
      return '';
   }

   // make a 2D array of all the voter's votes
   var votes = _.pluck(votesFromDB, 'vote');
   // clone so that votes aren't modified on database
   votes = _.clone(votes, true);
   // check who is the majority winner
   var majority = votes.length / 2;

   // iterate endlessly
   while (votes.length > 0) {
      var count = countVotes(votes);
      var min = "";
      var max = "";
      // for each iteration, check to see who is the winner and loser
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

      // if the winner of the round has the majority of votes, he wins
      if (max.freq >= majority) {
         return max.candidate;
      }

      // remove loser from votes for next iteration
      votes = removeLoser(votes, min.candidate);
   }

   return;
}

/***********************************************************************/
/************************ HELPER METHODS *******************************/
/***********************************************************************/

/**
 * Returns a count of the first pick of each vote
 * @param votes: array of voter's votes in order of preference. ex:
 * [ 
 *   { voter: 'abc', votes: ['candidate1', 'candidate2', 'candidate3'] },
 *   { voter: 'def', votes: ['candidate2', 'candidate1', 'candidate3'] },
 *   { voter: 'ghi', votes: ['candidate1', 'candidate3', 'candidate2'] }
 * ]
 * @return dictionary of the count of the first pick of each voter. ex:
 *    { 'candidate1': 2, 'candidate2': 1}
*/
function countVotes(votes) {
   var firstVoteFreq = _.countBy(votes, function(vote) {
      return vote[0];
   })
   return firstVoteFreq;
}

/**
 * Removes the loser from the votes. Loser is calculated by the candidate with the
 * least number of votes in each voter's first preference.
 * @param votes: array of voter's votes in order of preference. ex:
 * [ 
 *   { voter: 'abc', votes: ['candidate1', 'candidate2', 'candidate3'] },
 *   { voter: 'def', votes: ['candidate2', 'candidate1', 'candidate3'] },
 *   { voter: 'ghi', votes: ['candidate1', 'candidate3', 'candidate2'] }
 * ]
 * @return: modified votes input without loser. ex: loser = 'candidate2'
 *  [ 
 *   { voter: 'abc', votes: ['candidate1', 'candidate3'] },
 *   { voter: 'def', votes: ['candidate1', 'candidate3'] },
 *   { voter: 'ghi', votes: ['candidate1', 'candidate3'] }
 * ]
*/
function removeLoser(votes, loser) {
   return _.forEach(votes, function(vote) {
      _.pull(vote, loser);
   })
}

function sortKeysByValue(obj) {
   return _.sortBy(_.keys(obj), function (key) {
      return obj[key];
   });
}

module.exports.instantRunOff = instantRunOff;
module.exports.classicalElection = classicalElection;