var async = require('async');
var mongoose = require('mongoose');
var User = require('../../models/user.js');

module.exports = (function() {
  return function login(req, res, next) {
    var currentUser;

    return async.waterfall([
      function(callback) {
        if (req.body.email || req.body.password) {
          if (!req.body.email) {
            return res.json(400, {
              field: 'email',
              error: 'Email must be filled'
            });
          } else if (!req.body.password) {
            return res.json(400, {
              field: 'password',
              error: 'Password must be filled'
            });
          }
          return User.findOne({ email: req.body.email }, function(err, user) {
            if (err) { return next(err); }
            if (!user) {
              return callback(null, null);
            }
            return user.comparePassword(req.body.password, function(err, isMatch) {
              if (err) { return next(err); }
              return callback(null, isMatch ? user : null);
            });
          });
        } else if (req.body.userId || req.body.sessionToken) {
          if (!req.body.userId) {
            return res.json(400, { field: 'userId' });
          } else if (!req.body.sessionToken) {
            return res.json(400, { field: 'sessionToken' });
          }
          return User.findOne({ id: req.body.userId, sessionToken: req.body.sessionToken }, callback);
        } else {
          return res.json(400, {
            field: 'email/password or userId/sessionToken'
          });
        }
      }, function(_user, callback) {
        if (!_user) {
          if (req.body.email || req.body.password) {
            return res.json(404, { error: 'User not found or wrong email/password combination' });
          } else {
            return res.json(404, { error: 'User not found or Wrong userId/sessionToken combination' });
          }
        }
        currentUser = _user;
        currentUser.sessionToken = User.randomToken();
        return currentUser.save(callback);
      }, function(currentUser, numberAffected, callback) {
        if (!currentUser.instagram || !currentUser.instagram.sessionToken || currentUser.instagram.sessionToken === '') {
          return res.json(403, {
            userId: currentUser._id,
            sessionToken: currentUser.sessionToken
          });
        }
        //TODO: Check the instagram sessionToken
        return currentUser.save(callback);
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
      return res.json(200, {
        userId: currentUser._id,
        sessionToken: currentUser.sessionToken
      });
    });
  };
})();