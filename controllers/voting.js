'use strict';

var mongoose = require('mongoose');
var xss = require('xss');
var _ = require('lodash');
var assert = require('assert');
var irv = require('./runOffVoting.js');

var Election = mongoose.model('Election');
var Vote = mongoose.model('Vote');


function getElections(req, res) {
   Election.find({}, 'name candidates creator', function(err, elections) {
      if (err) {
         res.status(400).send("Error");
      } else {
         res.status(200).json(elections);
      }
   });
}

function makeNewElection(req, res) {
   var newElectionData = {};
   newElectionData.name = xss(req.body.name);
   newElectionData.candidates = xss(req.body.candidates).split(',');
   newElectionData.candidates = _.uniq(newElectionData.candidates);
   newElectionData.creator = req.user.kerberos;

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

function getResult(req, res) {
   var electionID = xss(req.params.electionID);

   Election.findOne({_id: electionID})
      .populate('votes')
      .exec(function(err, election) {
         if (election) {
            if (election.creator === req.user.kerberos || req.user.role == 'admin') {
               var winner = irv.getWinner(election.votes);
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