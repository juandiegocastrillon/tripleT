'use strict';
/**
 * Define all the HTTP methods for all PM related actions
 */
module.exports = function(app) {
  var pm = require('../controllers/pm.js');

  app.route('/pm')
    .get(pm.getPmRequests)
    .post(pm.addRequest)
    .delete(pm.removeRequests);
}
