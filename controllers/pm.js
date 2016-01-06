'use strict';

var mongoose = require('mongoose');
var _        = require('lodash');
var xss      = require('xss');

var PmRequest = mongoose.model('PmRequest');

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

function addRequest(req, res){
  var newRequestData = {
    author : xss(req.body.author),
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