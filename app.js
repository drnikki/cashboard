// ************************************************************************* //
// ========================================================================= //
//
// Main node app file
//
// run 'node app.js' to start the app
//
// ========================================================================= //
// ************************************************************************* //




// ------------------------------------------------------------------------- //
// Standard install
// ------------------------------------------------------------------------- //


var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var dataRoutes = require('./routes/data');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get( '/data/:provider', dataRoutes.dataRouter );


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// ------------------------------------------------------------------------- //
// Cashboard stuff
// ------------------------------------------------------------------------- //

// get the data routes
var dataRoutes = require('./routes/data');

// handle requests

// for root, use the index
app.get('/', routes.index);
// for data/:provider urls, use the dataRouter
app.get( '/data/:provider', dataRoutes.dataRouter );
