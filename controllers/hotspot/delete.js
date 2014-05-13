var async = require('async');

module.exports = (function() {
  return function(req, res, next) {
    if (!req.params.hotSpotId) {
      return res.json(400, { field: 'hotSpotId' });
    }
    return async.waterfall([
      function(callback) {
        for (var i = 0; i < req.currentUser.hotspots.length; ++i) {
          if (req.currentUser.hotspots[i].id === req.params.hotSpotId) {
            req.currentUser.hotspots.splice(i, 1);
            return req.currentUser.save(callback);
          }
        }
        return res.json(404, { error: 'HotSpot not found' });
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
      return res.json(200, {});
    });
  };
})();
