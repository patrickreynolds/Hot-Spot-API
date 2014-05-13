var async = require('async');
var _ = require('underscore');
var instagram = require('../../libs/instagram');

module.exports = (function() {
  return function feed(req, res, next) {
    if (req.currentUser.hotspots.length === 0) {
      return res.json(200, {
        mediaList: []
      });
    }
    var hotspotsFetcherList = _.map(req.currentUser.hotspots, function(hotspot) {
      return function(callback) {
        return instagram.hotspot({
          lat: hotspot.lat,
          lng: hotspot.lng,
          distance: 200
        }, req.currentUser.instagramSessionToken, callback);
      };
    });

    return async.parallel(hotspotsFetcherList, function(err, instagramHotspots) {
      if (err) {
        return next(err);
      }
      var mediaList = [];
      _.each(instagramHotspots, function(instagramHotspot) {
        if (instagramHotspot.meta.code !== 200) {
          return res.json(401, {
            field: 'instagramSessionToken',
            error: 'Bad or expired instagramSessionToken'
          });
        }
        return _.each(instagramHotspot.data, function(instagramHotspotMedia) {
          return mediaList.push(instagramHotspotMedia);
        });
      });
      return res.json(200, {
        mediaList: _.sortBy(mediaList, function(media) { return -media.created_time; })
      });
    });
  };
})();
