'use strict';

module.exports = function(app) {
   var voting = require('../controllers/voting');
   app.route("/voting")
      .get(voting.getElections)
      .post(voting.makeNewElection);

   app.route("/voting/:electionID")
      .get(voting.getElection)
      .post(voting.castVote)
      .delete(voting.deleteElection);

   app.route("/voting/:electionID/votes")
      .get(voting.getVotes)

   app.route("/voting/:electionID/results")
      .get(voting.getResult);

   // bind :userId to req.profile
   // app.param('electionID', voting.voteByID);
}