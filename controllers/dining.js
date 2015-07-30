'use strict';

var mongoose = require('mongoose');
var xss = require('xss');
var _ = require('lodash');
var assert = require('assert');

var DiningWeek = mongoose.model('DiningWeek');

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
 * We should only have one dining week object in backend. Return the ID.
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

function updateDining(req, res) {
   var diningWeekID = xss(req.params.diningID);
   var updatedWeek = req.body.updatedWeek;
   console.log(updatedWeek);

   DiningWeek.findOne({_id: diningWeekID})
      .exec(function(err, week) {
         if (week) {
            _.forEach(updatedWeek, function(value, dayofweek) {
               if (!_.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], dayofweek)) {
                  res.status(400).send(dayofweek + " is not a day of the week");
               }
               week[dayofweek] = updatedWeek[dayofweek];
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