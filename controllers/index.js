module.exports = {
  index: function(req, res) {
    return res.send('Hello world!');
  },

  user: require('./user')
};
