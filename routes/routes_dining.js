'use strict';
/**
 * Define all the HTTP methods for all dining related actions
 */

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
}