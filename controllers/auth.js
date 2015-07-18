"use strict";

var _ = require('lodash');

module.exports = function(app) {
   app.all("*", loadUser, isPhiSig);
}

function loadUser(req, res, next) {
   var user = req.connection.getPeerCertificate().subject;
   var name = user.CN.split(" ");

   req.user = {};
   req.user.name = name;
   req.user.firstName = _.first(name);
   req.user.lastName = _.last(name);
   req.user.initials = _.map(name, function(word) { return word[0]; }).join('');
   req.user.email = user.emailAddress;
   req.user.kerberos = user.emailAddress.split('@')[0];

   next();
}

function isPhiSig(req, res, next) {
   var phiSigKerberos = [
      'jdcastri'
   ];

   if (_.includes(phiSigKerberos, req.user.kerberos)) {
      next();
   } else {
      res.status(400).send("You're not Phi Sig");
   }
}