var _ = require('underscore');
var controllers = require('../controllers');
var User = require('../models/user.js');

var loadUserFromSessionToken = function(options) {
  options = _.defaults(options || {}, {
    'fields': null
  });
  return function(req, res, next) {
    if (!req.param('sessionToken')) {
      return res.json(400, { field: 'sessionToken' });
    }
    var conditions = { 'sessionToken': req.param('sessionToken') };
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

  app.post('/user/signup', controllers.user.signup);

  app.post('/user/login', controllers.user.login);

  app.post('/user/associate',
    loadUserFromSessionToken(),
    controllers.user.associate);

  app.get('/hotspots',
    loadUserFromSessionToken(),
    controllers.hotspots.list);

  app.get('/hotspots/feed',
    loadUserFromSessionToken(),
    controllers.hotspots.feed);

  app.post('/hotspot',
    loadUserFromSessionToken(),
    controllers.hotspot.create);

  app.post('/hotspot/:hotSpotId/delete',
    loadUserFromSessionToken(),
    controllers.hotspot.delete);

  app.get('/hotspot/:lat/:lng',
    loadUserFromSessionToken(),
    controllers.hotspot.fetch);
};
