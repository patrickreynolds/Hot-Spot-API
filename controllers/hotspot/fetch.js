var async = require('async');
var _ = require('underscore');
var instagram = require('../../libs/instagram');

module.exports = (function() {
  return function fetch(req, res, next) {
    if (!req.params.lat) {
      return res.json(400, { field: 'lat' });
    } else if (!req.params.lng) {
      return res.json(400, { field: 'lng' });
    }
    return async.waterfall([
      function(callback) {
        return instagram.hotspot({
          lat: req.params.lat,
          lng: req.params.lng,
          distance: 200
        }, req.currentUser.instagramSessionToken, callback);
      }
    ], function(err, _instagramHotspot) {
      if (err) {
        return next(err);
      }
      if (_instagramHotspot.meta.code !== 200) {
        return res.json(401, {
          field: 'instagramSessionToken',
          error: 'Bad or expired instagramSessionToken'
        });
      }
      return res.json(200, {
        mediaList: _.sortBy(_instagramHotspot.data, function(media) { return -media.created_time; })
      });
    });
  };
})();
