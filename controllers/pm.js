'use strict';

var mongoose = require('mongoose');

var PmRequestContainer = mongoose.model('PmRequestContainer');

/**
 * Like dining, should only have one requestContainer object stored.
 */
function getPmReqID(req, res) {
  PmRequestContainer.findOne({}, function(err, pmRequests) {
    if (pmRequests) {
      res.status(200).json(pmRequests);
    } else {
      res.status(400).send(err);
    }
  });
}

module.exports.getPmReqID = getPmReqID;
