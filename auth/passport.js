'use strict';

	var User = require('mongoose').model('User'),
	path = require('path');

module.exports = function(passport) {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	require('./strategies.local.js')(passport);
};