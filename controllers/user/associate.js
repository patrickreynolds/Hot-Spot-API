var async = require('async');
var instagram = require('../../libs/instagram');

module.exports = (function() {
  return function associate(req, res, next) {
    if (!req.body.instagramSessionToken) {
      return res.json(400, { field: 'instagramSessionToken' });
    }
    return async.waterfall([
      function(callback) {
        return instagram.user(req.body.instagramSessionToken, callback);
      },
      function(_instagramUser, callback) {
        if (_instagramUser.meta.code !== 200) {
          return res.json(401, {
            field: 'instagramSessionToken',
            error: 'Bad or expired instagramSessionToken'
          });
        }

        req.currentUser.instagramSessionToken = req.body.instagramSessionToken;
        // Here we can retrieve more information from Instagram

        return req.currentUser.save(callback);
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
      return res.json(200, {});
    });
  };
})();
