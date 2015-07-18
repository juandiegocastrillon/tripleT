"use strict";

module.exports = function(app) {
   app.route('/users/me')
      .get(function(req, res) {
         res.status(200).json(req.user);
      })
}