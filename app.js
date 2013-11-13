
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var data = require('./routes/data');

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

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// ------------------------------------------------------------------------- //
// Routes
// ------------------------------------------------------------------------- //

app.get( '/', routes.index );


// var config = require('config.js');

app.get( '/data/:provider', function(req, res) {

    var provider = req.params.provider;

    // if we have a handler for that url
    if ( data.hasOwnProperty(provider) ) {

        data[provider](req,res);

    // otherwise json error
    } else {

        res.json({
            "errors" : [
                {
                    "message" : "Incorrect URL?"
                }
            ]
        });
    }

});
