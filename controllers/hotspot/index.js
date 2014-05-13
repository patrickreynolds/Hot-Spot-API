module.exports = (function() {
  return {
    create: require('./create'),
    fetch: require('./fetch'),
    'delete': require('./delete')
  };
})();
