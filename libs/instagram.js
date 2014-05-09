var request = require('request');

module.exports = (function() {
  var BASE_URL = 'https://api.instagram.com/';
  var VERSION = 'v1';

  var user = function(access_token, callback) {
    return api_get('/users/self?access_token=' + access_token, callback);
  };

  var api_get = function(path, callback) {
    if (path[0] !== '/') {
      path = '/' + path;
    }
    return request({
      url: BASE_URL + VERSION + path,
      json: true
    }, function(error, response, body) {
      if (error) {
        return callback(error, body);
      } else if (response.statusCode !== 200) {
        return callback(new Error('Instagram API is unavailable (statusCode: ' + response.statusCode + ')'), body);
      } else {
        return callback(null, body);
      }
    });
  };

  var api_post = function(path, data, callback) {
    if (path[0] !== '/') {
      path = '/' + path;
    }
    return request({
      method: 'post',
      url: BASE_URL + VERSION + path,
      form: data
    }, function(error, response, body) {
      if (error) {
        return callback(error, body);
      } else {
        return callback(null, body);
      }
    });
  };

  return {
    api_get: api_get,
    api_post: api_post,
    user: user
  };
})();
