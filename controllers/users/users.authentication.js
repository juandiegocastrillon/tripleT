'use strict';

var _ = require('lodash');

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
var signup = function(req, res) {
	if (req.user) {
		res.status(200).send(_.omit(req.user, 'salt', 'password'));
	} else {
		res.status(400).send(err);
	}	
}

/**
 * 
 */

/**
 * Signin after passport authentication
 * @route : POST /auth/signin
 * @req_param:
 * 		email : string
 * 		kerberos : string
 * @return User Object - success
 * 			{message: 'Missing Credentials'} - failure
 */
var signin = function(req, res) {
	if (req.user) {
		res.status(200).send(req.user);	
	} else {
		res.status(400).send(err);
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

module.exports.signup = signup;
module.exports.signin = signin;
module.exports.signout = signout;