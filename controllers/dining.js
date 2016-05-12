'use strict';

/**
 * Controller that handles all changes to Dining.
 * There should only be one dining week object in the database, ever.
 * Each week, the dining week should be modified.
 */

var mongoose = require('mongoose');
var xss = require('xss');
var _ = require('lodash');
var assert = require('assert');

var DiningWeek = mongoose.model('DiningWeek');

/**
 * Creates a new dining week. Should only be called once, ever.
 * @return {Object} - the new dining week.
 */
function makeNewWeek(req, res) {
   var daysParams = {
      Sunday: {
         Acomm: 'Juandi',
         menu: 'chicken'
      },
      Monday: {
         Acomm: 'Juandi',
         menu: 'chicken'
      },
      Tuesday: {
         Acomm: 'Juandi',
         menu: 'chicken'
      },
      Wednesday: {
         Acomm: 'Juandi',
         menu: 'chicken'
      },
      Thursday: {
         Acomm: 'Juandi',
         menu: 'chicken'
      }
   }

   var newWeek = new DiningWeek(daysParams);

   newWeek.save(function(err, week) {
      if (week) {
         res.status(200).json(week);
      } else {
         res.status(400).send(err);
      }
   });
}

/**
 * Returns the dining week.
 * We should only have one dining week object in backend.
 * @return {object} - the dining week
 */
function getDiningWeek(req, res) {
   DiningWeek.findOne({}, function(err, week) {
      if (week) {
         res.status(200).json(week);
      } else {
         res.status(400).send(err);
      }
   });
}

/**
 * Very similar to method above. This time you pass in the dining ID.
 * @param {String} req.params.diningID - the diningID from the database. Params are in the URL
 * @return {object} - the dining week
 */
function getDining(req, res) {
   var diningWeekID = xss(req.params.diningID);

   DiningWeek.findOne({_id: diningWeekID})
      .exec(function(err, week) {
         if (week) {
            res.status(200).json(week);
         } else {
            res.status(400).send(err);
         }
      })
}

/**
 * Completely overwrite the dining week. Very naïve to completely overwrite instead of making individual
 * change methods, I know.
 * @param {String} req.params.diningID - the diningID from the database. Params are in the URL
 * @return {object} - the dining week
 */
function updateDining(req, res) {
   var diningWeekID = xss(req.params.diningID);
   var updatedWeek = req.body.updatedWeek;

   DiningWeek.findOne({_id: diningWeekID})
      .exec(function(err, week) {
         if (week) {
            _.forEach(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], function(dayofweek) {
               if (_.has(updatedWeek, dayofweek)) {
                  week[dayofweek] = updatedWeek[dayofweek];
               }
            });
            week.save(function(err, week) {
               if (err) {
                  res.status(400).json(err);
               } else {
                  res.status(200).json(week);
               }
            });
            
         } else {
            console.log(err);
            res.status(400).json(err);
         }
      })
}

/**
 * Add a late plate to the specified day of the week. The kerberos is grabbed from the signed-in user.
 * @param {String} req.params.diningID - the diningID from the database. Params are in the URL
 * @param {String} req.body.dayofweek - the day of the week the late plate needs to be added to
 * @return {object} - the dining week
 */
function addLatePlate(req, res) {
   var name = req.user.kerberos;
   var dayofweek = xss(req.body.dayofweek);
   var diningWeekID = xss(req.params.diningID);

   DiningWeek.findOne({_id: diningWeekID})
      .exec(function(err, week) {
         if (week) {
            if (!_.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], dayofweek)) {
               res.status(400).send(dayofweek + " is not a day of the week");
            } else {
               if (_.includes(week[dayofweek].latePlates, name)) {
                  res.status(200).json(week);
               } else {
                  week[dayofweek].latePlates.push(name);
                  week.save(function(err, week) {
                     if (err) {
                        res.status(400).json(err);
                     } else {
                        res.status(200).json(week);
                     }
                  });   
               }
            }
         } else {
            console.log(err);
            res.status(400).json(err);
         }
      })
}

/**
 * Remove a late plate to the specified day of the week. The kerberos is grabbed from the signed-in user.
 * @param {String} req.params.diningID - the diningID from the database. Params are in the URL
 * @param {String} req.body.dayofweek - the day of the week the late plate needs to be added to
 * @return {object} - the dining week
 */
function removeLatePlate(req, res) {
   var name = req.user.kerberos;
   var dayofweek = xss(req.body.dayofweek);
   var diningWeekID = xss(req.params.diningID);

   DiningWeek.findOne({_id: diningWeekID})
      .exec(function(err, week) {
         if (week) {
            if (!_.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], dayofweek)) {
               res.status(400).send(dayofweek + " is not a day of the week");
            } else {
               if (!_.includes(week[dayofweek].latePlates, name)) {
                  res.status(200).json(week);
               } else {
                  week[dayofweek].latePlates.pull(name);
                  week.save(function(err, weekUpdated) {
                     if (err) {
                        res.status(400).json(err);
                     } else {
                        res.status(200).json(weekUpdated);
                     }
                  });
               }
            }
         } else {
            console.log(err);
            res.status(400).json(err);
         }
      })
}

module.exports.makeNewWeek = makeNewWeek;
module.exports.getDining = getDining;
module.exports.getDiningWeek = getDiningWeek;
module.exports.updateDining = updateDining;
module.exports.addLatePlate = addLatePlate;
module.exports.removeLatePlate = removeLatePlate;