'use strict';

/**
 * Module dependencies.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');
var _ = require('lodash');

module.exports = function(passport) {
	// Use local strategy
	passport.use('validated-get-user', new LocalStrategy({
			usernameField: 'kerberos',
			passwordField: 'password',
			// passReqToCallback : true
		},
		function(kerberos, password, done) {
			User.findOne({
				kerberos: kerberos
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'Unknown user' });
				}
				if (!user.authenticate(password)) {
					return done(null, false, { message: 'Incorrect password' });
				}

				return done(null, user, { user: user });
			});
		}
	));

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with kerberos
		usernameField : 'kerberos',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
   },
   function(req, kerberos, password, done) {
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			// find a user whose kerberos is the same as the forms kerberos
			// we are checking to see if the user trying to signup already exists
			User.findOne({ 'kerberos' :  kerberos }, function(err, user) {
				// if there are any errors, return the error
				if (err) {
					return done(err);
				}

				// check to see if theres already a user with that kerberos
				if (user) {
					return done(null, false, { message: 'User with that kerberos already exists' });
				} else {
					// if there is no user with that kerberos
					// create the user
					var newUser = new User(req.body);

					// set the user's local credentials
					newUser.provider = 'local';
					newUser.displayName = newUser.name.split(' ')[0];

					// save the user
					newUser.save(function(err) {
						if (err) {
							// get all error messages
							var messages = [];
							_.forEach(err.errors, function(error) {
								messages.push(error.message);
							});
							return done(null, false, {message: messages[0]})
						}
						return done(null, newUser);
					});
				}
			});    

		});

   }));
};