// @author: Juan Diego Castrillon
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

var allUsers = function(req, res) {
	User.find({}, function(err, users) {
		if (!users) {
			return res.status(500).send({
				'message': "Couldn't get users"
			});
		} else {
			res.jsonp(users);
		}
	})
}
/**
 * Get a single User by ID.
 * @route GET /users/:userId
 * @param {String} req.profile.id = :userId
 * @return {JSON} success -> User Object
 * 				  failure -> {message: 'Couldn't get user with ID: id' }
 */
var one = function(req, res) {
	var _id = req.profile._id;
	User.findOne({ _id : _id}, function(err, user) {
		if (!user) {
			return res.status(500).send({
				'message' : 'Couldn\'t get user with ID: ' + _id
			});
		}
		res.jsonp(user);
	});
};

/**
 * Respond with currently loged-in User JSON
 * @route GET /users/me
 * @return {JSON} success -> User Object
 * 				  failure -> null
 */
var me = function(req, res) {
    if (req.user) {
        res.jsonp(req.user);
    } else {
        res.status(500).send("no user detected");
    }
};

/**
 * Delete a User
 * @route DELETE /users/:userId
 * @param {String} req.profile.id = :userId
 * @return {JSON} success -> {message: 'Success'
 * 				  failure -> {message: error-msg}
 */
var removeOne = function(req, res) {
	User.findOne({_id : req.profile._id}).remove(function(err) {
		if (err) {
			return res.status(500).send(err);
		}

		res.jsonp({'message' : 'Success'});
	});
};

/**
 * User Middleware asserting that signed-in User is the same as the requested User
 * @param  {String} req.user.id -> Signed-in User ID
 * @param  {String} req.profile._id -> Requests User ID
 * @param  {Function} next -> call next function. 
 * @return {Object} if failure -> {message: error-msg}
 */
var hasAuthorization = function(req, res, next) {
    if (req.user.id != (req.profile._id)) {
        return res.status(403).send({
            message: 'Only the signed in User can make this change to this User'
        });
    }
    next();
}

/**
 * User making change must have admin privileges
 */
var isAdmin = function(req, res ,next) {
    if (req.user.role == 'admin') {
        next();
    } else {
        return res.status(403).send({
            'message' : 'Only admin users can make this change'
        })
    }
}

/**
 * Change user permission of selected user
 * @param  {String} req.profile._id -> id of user to change permissions for
 * @param  {Function} next -> call next function.
 */
var changePermission = function(req, res) {
    // make sure at least one person is admin
    if (req.body.newRole != 'admin') {
        User.findOne({ role: 'admin'}).exec(function(err, user) {
            if (!user) {
                return res.status(403).send({
                    'message' : 'At least one person must be admin'
                })
            }
        });
    }
    
    User.update(
        {_id : req.profile._id}, 
        { $set: {
            role : req.body.newRole
        }}
    ).then(function(writeConcern) {
        if (writeConcern.ok) {
            res.jsonp({'message' : 'Success'});
        }
    })
}

module.exports.allUsers = allUsers;
module.exports.one = one;
module.exports.me = me;
module.exports.removeOne = removeOne;
module.exports.hasAuthorization = hasAuthorization;
module.exports.isAdmin = isAdmin;
module.exports.changePermission = changePermission;