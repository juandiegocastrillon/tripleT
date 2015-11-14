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
 * @route : POST /auth/signup
 * @req_param:
 * 		name : string
 * 		kerberos : unique string
 * 		password : string longer than 6 characters
 * 		role : string describing privileges
 * @return User Object - success
 * 			{message: error-message} - failure
 */
var signup = function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			throw err;
		}
		else if (user) {
			console.log("YES");
			console.log(user);
			console.log(_.omit(user, 'password'));
			res.status(200).send(_.omit(user, 'salt', 'password'));
		} else {
			console.log(info);
			res.status(400).send(info);
		}
	})(req, res, next);
}

/**
 * 
 */

/**
 * Signin after passport authentication
 * @route : POST /auth/signin
 * @req_param:
 * 		kerberos : string
 * 		password : string
 * @return User Object - success
 * 			{message: 'Missing Credentials'} - failure
 */
var signin = function(req, res, info) {
	if (req.user) {
		res.status(200).send(req.user);	
	} else {
		res.status(400).send('no user');
	}
	
}

/**
 * Signout
 * @route : GET /auth/signout
 * @return 'Success' - success
 */
var signout = function(req, res) {
	req.logout();
	res.redirect('/#/userManagement');
};

var changepassword = function(req, res, next) {
	passport.authenticate('validated-get-user', function(err, user, info) {
		if (err)
			throw err;
		else if (user) {
			var newPassword = xss(req.body.newPassword);
			var success = user.changePassword(newPassword);
			if (success)
				res.status(200).send();
			else 
				res.status(400).send({'message': 'Password not long enough'});
		}
		else {
			res.status(400).send(info);
		}
	})(req, res, next);
}

module.exports.signup = signup;
module.exports.signin = signin;
module.exports.signout = signout;
module.exports.changepassword = changepassword;