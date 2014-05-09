var async = require('async');
var User = require('../../models/user.js');

module.exports = (function() {
  return function login(req, res, next) {
    return async.waterfall([
      function(callback) {
        if (typeof req.body.email !== 'undefined' || typeof req.body.password !== 'undefined') {
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
        } else if (typeof req.body.userId !== 'undefined' || typeof req.body.sessionToken !== 'undefined') {
          if (!req.body.userId) {
            return res.json(400, { field: 'userId' });
          } else if (!req.body.sessionToken) {
            return res.json(400, { field: 'sessionToken' });
          }
          return User.findOne({ _id: req.body.userId, sessionToken: req.body.sessionToken }, callback);
        } else {
          return res.json(400, {
            field: 'email/password or userId/sessionToken',
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
        _user.sessionToken = User.randomToken();
        return _user.save(callback);
      }, function(currentUser, numberAffected, callback) {
        if (!currentUser.instagramSessionToken || currentUser.instagramSessionToken === '') {
          return res.json(403, {
            userId: currentUser._id,
            sessionToken: currentUser.sessionToken
          });
        }
        //TODO: Check the instagram sessionToken
        return currentUser.save(callback);
      }
    ], function(err, currentUser) {
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
