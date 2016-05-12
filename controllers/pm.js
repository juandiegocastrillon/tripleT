'use strict';
/**
 * Controller that handles all changes to PM Requests.
 */
var mongoose = require('mongoose');
var _        = require('lodash');
var xss      = require('xss');

var PmRequest = mongoose.model('PmRequest');

/**
 * Get all PM Requests
 * @return {Array} - array of all pm requests
 */
function getPmRequests(req, res) {
  PmRequest.find({})
    .populate("author")
    .exec(function(err, pmRequests) {
    if (pmRequests) {
      res.status(200).json(pmRequests);
    } else {
      res.status(400).send(err);
    }
  });
}

/**
 * Make a new PM Request
 * @param {String} req.body.item - the item description
 * @param {String} req.body.reason - the reason behind the request
 * @return {array} - updated array of pm requests
 */
function addRequest(req, res){
  var newRequestData = {
    author : xss(req.user._id),
    item   : xss(req.body.item),
    reason : xss(req.body.reason)
  };

  PmRequest.findOne(newRequestData)
    .exec(function(err, repeatedRequest) {
      if(repeatedRequest) {
        res.status(400).send("Repeated Request");
      } else {
        var newReq = new PmRequest(newRequestData);
        newReq.save(function(err, pmRequest) {
          if (pmRequest) {
            PmRequest.findOne({_id: pmRequest.id})
              .populate('author')
              .exec(function(err, populatedRequest) {
                res.status(200).send(populatedRequest);
            });
          } else {
            res.status(400).send("couldn't create pmrequest");
          }
        })
      }
    });
}

/**
 * Remove a PM Request
 * @param {Array} req.body.pmRequests - array of PM Request IDs to be deleted
 */
function removeRequests(req, res){
  var pmRequests = JSON.parse(xss(req.query.pmRequests));
  _.forEach(pmRequests, function(pmID) {
    PmRequest.findOne({_id: pmID})
      .remove(function(err) {
        res.status(200).send();
    });
  });
}

module.exports.addRequest            = addRequest;
module.exports.getPmRequests         = getPmRequests;
module.exports.removeRequests        = removeRequests;