var _ = require('underscore');
var controllers = require('../controllers');
var User = require('../models/user.js');

var loadUserFromSessionToken = function(options) {
  options = _.defaults(options || {}, {
    'fields': null
  });
  return function(req, res, next) {
    if (!req.query.sessionToken) {
      return res.json(400, { field: 'sessionToken' });
    }
    var conditions = { 'sessionToken': req.query.sessionToken };
    var returnCurrentUser = function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json(401, {
          error: 'sessionToken',
          message: 'Invalid session token'
        });
      }
      req.currentUser = user;
      return next();
    };
    return User.findOne(conditions, options.fields, returnCurrentUser);
  };
};

module.exports = function(app) {
  app.get('/', controllers.index);
};
