'use strict';

module.exports = function(app) {
  var pm = require('../controllers/pm.js');

  app.route('/pm')
    .get(pm.getPmReqID);
}
