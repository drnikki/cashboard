
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');

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

app.get( '/data/googleanalytics', function(req, res) {


    var GA = require('googleanalytics');
    var util = require('util');
    var GAconfig = {
        "user" : 'test@yellowsmith.com',
        "password": "testtest"
    };
    var ga = new GA.GA(GAconfig);

    ga.login(function(err, token) {

        var options = {
            'ids': 'ga:77232304',
            'start-date': '2013-10-11',
            'end-date': '2013-11-30',
            //'dimensions': 'ga:visitCount',
            'metrics': 'ga:visitors, ga:percentNewVisits',
            //'sort': '-ga:visitCount'
        };

        ga.get(options, function(err, entries) {
            // its an array and I don't want that
            res.json(entries[0]);
        });
    });

});
