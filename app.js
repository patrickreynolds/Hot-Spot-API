var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database.mongo_uri);

var app = express();

app.set('port', config.server.port);
app.use(require('morgan')('dev'));
app.use(require('body-parser')());

if ('development' == app.get('env')) {
  app.use(require('errorhandler')());
}

require('./routes')(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + ' in ' + app.settings.env + ' mode');
});
