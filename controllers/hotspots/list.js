module.exports = (function() {
  return function list(req, res) {
    return res.json(200, {
      hotspots: req.currentUser.hotspots
    });
  };
})();
