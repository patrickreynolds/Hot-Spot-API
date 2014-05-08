module.exports = (function() {
  return function hotspots(req, res) {
    return res.json(200, {
      hotspots: req.currentUser.hotspots
    });
  };
})();
