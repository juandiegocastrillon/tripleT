// @author: Juan Diego Castrillon
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware - assigns User object to req.profile if user id is valid
 * @param {String} id - user id of route
 */
var userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		// if (err) console.log(err);return next(err);
		if (!user) {
			return res.status(500).send({
				'message' : 'Failed to load User ' + id
			});
		}
		req.profile = user;
		next();
	});
};

/**
 * User middleware
 * Asserts that user is currently logged in through passport-js
 */
var requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

module.exports.userByID = userByID;
module.exports.requiresLogin = requiresLogin;