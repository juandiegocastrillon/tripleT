'use strict';

/**
 * Controller that handles all changes to elections
 */

var mongoose = require('mongoose');
var xss = require('xss');
var _ = require('lodash');
var assert = require('assert');
var votingAlgo = require('./votingAlgorithms.js'); // voting algorithms

// load the back-end models
var Election = mongoose.model('Election');
var Vote = mongoose.model('Vote');

/**
 * Returns all elections
 * @return {Object} - all elections. The 'name', 'candidates', and 'creator' field will only be populated
 */
function getElections(req, res) {
   Election.find({}, 'name candidates creator', function(err, elections) {
      if (err) {
         res.status(400).send("Error");
      } else {
         res.status(200).json(elections);
      }
   });
}

/**
 * Create a new election
 * @param {String} req.body.name - Name of the new election
 * @param {String} req.body.candidates - all candidates of the election, separated by a comma
 * @param {String} req.body.creator - kerberos of the creator of the election
 * @param {int} req.body.numWinners - number of winners in the election. If numWinners is 1, 
 *                                     decide winner by run-off voting. If more than one winner,
 *                                     decide winner by tallying votes.
 * @return {Object} the new election
 */
function makeNewElection(req, res) {
   var newElectionData = {};
   newElectionData.name = xss(req.body.name);
   newElectionData.candidates = xss(req.body.candidates).split(',');
   newElectionData.candidates = _.uniq(newElectionData.candidates);
   newElectionData.creator = req.user.kerberos;
   newElectionData.numWinners = req.body.numWinners;

   var newElection = new Election(newElectionData);

   newElection.save(function(err, election) {
      if (election) {
         res.status(200).json(election);
      } else {
         console.log(err);
         res.status(400).send("Could not create election");
      }
   });
}

/**
 * Get the election
 * @param {String} req.params.electionID - the election ID in the URL of the route
 * @return {Object} the election object in the database
 */
function getElection(req, res) {
   var electionID = xss(req.params.electionID);

   Election.findOne({_id: electionID})
      .populate('votes')
      .exec(function(err, election) {
         if (election) {
            res.status(200).json(election);
         } else {
            console.log(err);
            res.status(400).send("Couldn't get votes");
         }
      });
}

/**
 * Get the votes for an election
 * @param {String} req.params.electionID - the election ID in the URL of the route
 * @return {Array} the votes array from that election
 */
function getVotes(req, res) {
   var electionID = xss(req.params.electionID);

   Election.findOne({_id: electionID})
      .populate('votes')
      .exec(function(err, election) {
         if (election) {
            res.status(200).json(election.votes);
         } else {
            console.log(err);
            res.status(400).send("Couldn't get votes");
         }
      });
}

/**
 * Cast a vote for this election
 * @param {String} req.params.electionID - the election ID in the URL of the route
 * @param {String} req.user.kerberos - the kerberos of the person voting. req.user comes from the currently signed-in user.
 * @param {Array} reqw.body.vote - an array of the ordering of the candidates for this vote
 * @return {Object} the election object in the database
 */
function castVote(req, res) {
   var electionID = xss(req.params.electionID);
   var voteData = {};

   voteData.voter = req.user.kerberos;
   voteData.vote = req.body.vote;

   var newVote = new Vote(voteData);
   Election.findOne({_id: electionID})
      .exec(function(err, election) {
         if (election) {
            newVote.save(function(err, voteCast) {
               if (voteCast) {
                  var errMessage = '';
                  _.forEach(voteCast.vote, function(candidateVote) {
                     if (!_.includes(election.candidates, candidateVote)) {
                        voteCast.remove();
                        errMessage += candidateVote + " is not a candidate.\n";
                     }
                  });

                  if (!_.isEqual(_.sortBy(voteCast.vote), _.sortBy(election.candidates)) || 
                     voteCast.vote.length !== election.candidates.length ) {
                     voteCast.remove();
                     errMessage += "Not all candidates were ranked.\n";
                  } 

                  if (errMessage) {
                     console.log(errMessage);
                     res.status(400).send(errMessage);
                  } else {
                     election.castVote(voteCast);
                     res.status(200).json(election);
                  }
               } else {
                  console.log(err);
                  res.status(400).send("Couldn't create vote");
               }
            })
         } else {
            console.log(err);
            res.status(400).send("No such election");
         }
      });
}

/**
 * Delete the election
 * @param {String} req.params.electionID - the election ID in the URL of the route
 */
function deleteElection(req, res) {
   var electionID = xss(req.params.electionID);
   Election.findOne({_id: electionID})
      .remove(function(err, election) {
         if (err) {
            res.status(500).json(err);
         } else {
            res.status(200).end();
         }
      });
}

/**
 * Determine the winner of an election. If there is only one winner in the election,
 * determine winner by instant run off voting. Otherwise, tally the votes of the first
 * numWinners candidates in every vote.
 * @param {String} req.params.electionID - the election ID in the URL of the route
 * @return {String} - candidate that won the election
 */
function getResult(req, res) {
   var electionID = xss(req.params.electionID);

   Election.findOne({_id: electionID})
      .populate('votes')
      .exec(function(err, election) {
         if (election) {
            if (election.creator === req.user.kerberos || req.user.role == 'admin') {
               var winner;
               if (election.numWinners == 1) {
                  winner = votingAlgo.instantRunOff(election.votes);
               } else {
                  winner = votingAlgo.classicalElection(election.votes, election.numWinners);
               }
               res.status(200).send(winner);   
            } else {
               res.status(400).send("Not authorized to get winner");
            }
         } else {
            console.log(err);
            res.status(400).send("Couldn't get votes");
         }
      });
}

module.exports.getElections = getElections;
module.exports.makeNewElection = makeNewElection;
module.exports.getElection = getElection;
module.exports.getVotes = getVotes;
module.exports.castVote = castVote;
module.exports.deleteElection = deleteElection;
module.exports.getResult = getResult;