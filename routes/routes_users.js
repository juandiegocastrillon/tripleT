/**
 * These routes are anchored to the methods defined in the users controllers
 */
'use strict';

var passport = require('passport');

module.exports = function(app) {
   // User Routes
   var users = require('../controllers/users.controller.js');

   // Setting up the users profile api
   app.route('/users/me')
      .get(users.me);   
   app.route('/users/:userId')
      .get(users.one)
      .delete(users.requiresLogin, users.hasAuthorization, users.removeOne);

   app.route('/users/:userId/changePermission')
      .post(users.isAdmin, users.changePermission)

   app.route('/users')
      .get(users.requiresLogin, users.allUsers);

   // Setting up the users authentication api
   app.route('/auth/signUp').post(users.signUp);
   app.route('/auth/signIn').post(passport.authenticate('validated-get-user', {}), users.signIn);
   app.route('/auth/signOut').get(users.signOut);
   app.route('/auth/changePassword').post(users.changePassword);

   // middleware
   // bind :userId to users.userByID
   app.param('userId', users.userByID);
};