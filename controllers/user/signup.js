var async = require('async');
var validator = require('../../libs/validator');
var User = require('../../models/user.js');

module.exports = (function() {
  return function signup(req, res, next) {
    if (!req.body.email) {
      return res.json(400, {
        field: 'email',
        error: 'Email must be filled'
      });
    } else if (!validator.isEmail(req.body.email)) {
      return res.json(400, {
        field: 'email',
        error: 'Email must be valid'
      });
    } else if (!req.body.password) {
      return res.json(400, {
        field: 'password',
        error: 'Password must be filled'
      });
    } else if (req.body.password.length < 6) {
      return res.json(400, {
        field: 'password',
        error: 'Password length must be at least 6 characters'
      });
    }

    return async.waterfall([
      function(callback) {
        return User.isEmailExist(req.body.email, callback);
      },
      function(isEmailExist, callback) {
        if (isEmailExist) {
          return res.json(409, {
            field: 'email',
            error: 'Email already exists'
          });
        }

        var newUser = new User({
          email: req.body.email,
          password: req.body.password,
          sessionToken: User.randomToken()
        });
        return newUser.save(callback);
      }
    ], function(err, newUser) {
      if (err) {
        return next(err);
      }
      return res.json(200, {
        userId: newUser._id,
        sessionToken: newUser.sessionToken
      });
    });
  };
})();
