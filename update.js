// ************************************************************************* //
// ========================================================================= //
//
// Update script
//
// Updates the mongo db with fresh content
//
// ========================================================================= //
// ************************************************************************* //

// get the db
var mongojs = require('mongojs');
var db = require('./database.js');

// provider config
var config = require('./config.js');

// makes nice timestamps like this
// 2013-12-02T13:29:03-06:00
var moment = require('moment');


/*
db.twitter.find(function(err, docs) {
    console.log(docs);
});
*/

// ------------------------------------------------------------------------- //
// Twitter
// ------------------------------------------------------------------------- //


var Twitter = require('twitter');
var twit = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token,
    access_token_secret: config.twitter.access_token_secret
});

twit.verifyCredentials(function(data) {

    db.twitter.save({
        "timestamp" : moment().format(),
        "followers" : data.followers_count,
        "listed" : data.listed_count
    });

    console.log('***twitter data saved***');

});




// ------------------------------------------------------------------------- //
// Google
// ------------------------------------------------------------------------- //

var GA = require('googleanalytics');

var ga = new GA.GA({
    'user' : config.google_analytics.user,
    'password' : config.google_analytics.password
});

ga.login(function(err, token) {

    var metrics = [
        'ga:visitors',
        'ga:percentNewVisits'
    ];
    var dimensions = [
    ];

    // get now for timestamp
    var now = moment();
    // copy now and subtract a day
    // didn't work for some reason
    // var yesterday = moment( now ).subtract( 1, 'day' );

    var options = {
        'ids': 'ga:77232304',
        // 'yesterday' is a keyword. so is 'today'
        'start-date': 'yesterday',
        'end-date': 'yesterday',
        //'dimensions': dimensions.join(','),
        'metrics': metrics.join(','),
        //'sort': '-ga:visitCount'
    };

    ga.get(options, function(err, entries) {

        if (err) {console.log(err);}

        var data = entries[0];

        console.log(data);

        db.google.save({
            // @TODO: should this timestamp yesterday or today? stats are from yesterday
            "timestamp" : now.format(),
            "visitors" : data.metrics[0]['ga:visitors'],
            "percentNewVisits" : data.metrics[0]['ga:percentNewVisits']
        });

        console.log('***google data saved***');

    });
});
