var async = require('async');
var _ = require('underscore');

module.exports = (function() {
  return function create(req, res, next) {
    if (!req.body.name) {
      return res.json(400, {
        field: 'name',
        error: 'Name must be filled'
      });
    } else if (!req.body.lat) {
      return res.json(400, {
        field: 'lat',
        error: 'Lat must be filled'
      });
    } else if (!req.body.lng) {
      return res.json(400, {
        field: 'lng',
        error: 'Lng must be filled'
      });
    }
    return async.waterfall([
      function(callback) {
        var isNameExist =_.find(req.currentUser.hotspots, function(hotspot) { return hotspot.name === req.body.name; });
        if (isNameExist) {
          return res.json(409, {
            field: 'name',
            error: 'Name already exists'
          });
        }
        req.currentUser.hotspots.push({
          name: req.body.name,
          description: req.body.description || '',
          lng: req.body.lng,
          lat: req.body.lat
        });
        return req.currentUser.save(callback);
      }, function(currentUser) {
        return res.json(200, currentUser);
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
    });
  };
})();
