'use strict';

var _ = require('lodash');
var xss = require('xss');

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');
	

/**
 * Sign up controller
 * @route : POST /auth/signUp
 * @req_param:
 * 		name : string
 * 		kerberos : unique string
 * 		password : string longer than 6 characters
 * 		role : string describing privileges
 * @return User Object - success
 * 			{message: error-message} - failure
 */
var signUp = function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			throw err;
		}
		else if (user) {
			res.status(200).send(_.omit(user, 'salt', 'password'));
		} else {
			res.status(400).send(info);
		}
	})(req, res, next);
}

/**
 * 
 */

/**
 * Signin after passport authentication
 * @route : POST /auth/signIn
 * @req_param:
 * 		kerberos : string
 * 		password : string
 * @return User Object - success
 * 			{message: 'Missing Credentials'} - failure
 */
var signIn = function(req, res, info) {
	if (req.user) {
		res.status(200).send(req.user);	
	} else {
		res.status(400).send('no user');
	}
	
}

/**
 * Signout
 * @route : GET /auth/signOut
 * @return 'Success' - success
 */
var signOut = function(req, res) {
	req.logout();
	res.redirect('/#/userManagement');
};

var changePassword = function(req, res, next) {
	passport.authenticate('validated-get-user', function(err, user, info) {
		if (err)
			throw err;
		else if (user) {
			var newPassword = xss(req.body.newPassword);
			user.changePassword(newPassword);
			user.save(function(err, product, numAffected) {
				if (!err)
					res.status(200).send();
				else {
					var passwordErrors = err.errors.password;
					if (passwordErrors)
						res.status(400).send(passwordErrors.properties);
					else
						res.status(500).send();
				}
			});
		}
		else {
			res.status(400).send(info);
		}
	})(req, res, next);
}

module.exports.signUp = signUp;
module.exports.signIn = signIn;
module.exports.signOut = signOut;
module.exports.changePassword = changePassword;