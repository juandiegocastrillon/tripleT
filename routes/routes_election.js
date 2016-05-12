'use strict';
/**
 * Define all the HTTP methods for all elections related actions
 */
module.exports = function(app) {
   var election = require('../controllers/election');
   app.route("/election")
      .get(election.getElections)
      .post(election.makeNewElection);

   app.route("/election/:electionID")
      .get(election.getElection)
      .post(election.castVote)
      .delete(election.deleteElection);

   app.route("/election/:electionID/votes")
      .get(election.getVotes)

   app.route("/election/:electionID/results")
      .get(election.getResult);

   // app.param('electionID', election.voteByID);
}