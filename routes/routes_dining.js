'use strict';

module.exports = function(app) {
   var dining = require('../controllers/dining.js');

   app.route("/dining/")
      .post(dining.makeNewWeek)
      .get(dining.getDiningWeek);

   app.route("/dining/:diningID")
      .get(dining.getDining)
      .put(dining.updateDining);

   app.route("/dining/:diningID/latePlate/add")
      .put(dining.addLatePlate)

   app.route("/dining/:diningID/latePlate/remove")
      .put(dining.removeLatePlate)


   // bind :userId to req.profile
   // app.param('electionID', voting.voteByID);
}