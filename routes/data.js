// ************************************************************************* //
// ========================================================================= //
//
// JSON Data routes
//
// All JSON endpoints handled here
// data/:providers
//
// ========================================================================= //
// ************************************************************************* //

// get all configs
var config = require('../config');
// get the mongo db
var db = require("../database.js");

// holds all the routes
var dataRoutes = {};

// ------------------------------------------------------------------------- //
// Handle incoming routes
//
// is sent :provider parameter
// ------------------------------------------------------------------------- //

dataRoutes.dataRouter = function(req, res) {

    // the provider parameter from data/:providers
    var provider = req.params.provider;

    // if dataRoutes has a handler for that provider, use it
    if ( dataRoutes.hasOwnProperty(provider) ) {

        dataRoutes[provider](req,res);

    // otherwise do a json error
    } else {

        res.json({
            // status for not found?
            "statusCode" : 404,
            "errors" : [
                {
                    "message" : "Incorrect URL?"
                }
            ]
        });
    }

};


// ------------------------------------------------------------------------- //
// Google
// ------------------------------------------------------------------------- //

// get google module
var GA = require('googleanalytics');

dataRoutes.ga = function(req, res){

    // make a new google connection with this user/pass
    var ga = new GA.GA({
        'user' : config.google_analytics.user,
        'password' : config.google_analytics.password
    });

    // login
    ga.login(function(err, token) {

        // metrics and dimensions reference
        // https://developers.google.com/analytics/devguides/reporting/core/dimsmets

        // metrics you want from google
        var metrics = [
            'ga:visitors',
            'ga:percentNewVisits'
        ];
        // dimension you want from google
        var dimensions = [
        ];

        var options = {
            'ids': 'ga:77232304',
            'start-date': '2013-10-03',
            'end-date': '2013-10-03',
            //'dimensions': dimensions.join(','),
            'metrics': metrics.join(','),
            //'sort': '-ga:visitCount'
        };

        // get these
        ga.get(options, function(err, entries) {

            // return JSON
            // also its an array and I don't want that, so [0]
            res.json({
                // status for not found?
                "statusCode" : 200,
                "data" : entries[0]
            });
        });
    });

};

// ------------------------------------------------------------------------- //
// Instagram
// ------------------------------------------------------------------------- //

var Instagram = require('instagram-node-lib');

Instagram.set('client_id', config.instagram.client_id);
Instagram.set('client_secret', config.instagram.client_secret);

dataRoutes.instagram = function(req, res){

    Instagram.users.info({
        user_id: config.instagram.user_id,
        complete : function(data) {
            res.json({
                "statusCode" : 200,
                "data" : data
            });
        }
    });

};

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

dataRoutes.twitter = function(req, res) {

    twit
        .verifyCredentials(function(data) {
            res.json({
                "statusCode" : 200,
                "data" : data
            });
            /*
            twit.get('/followers/ids.json?user_id=' + config.twitter.user_id, {include_entities:true}, function(data) {
                res.json(data);
            });
            */
        });

};

// ------------------------------------------------------------------------- //
// Mailchimp
// ------------------------------------------------------------------------- //

var mcapi = require('mailchimp-api');
var mc = new mcapi.Mailchimp( config.mailchimp.key );

dataRoutes.mailchimp = function(req, res) {

    mc.lists.list({}, function(data) {
        res.json({
            "statusCode" : 200,
            "data" : data
        });
    });

};

// ------------------------------------------------------------------------- //
// Export
// ------------------------------------------------------------------------- //

module.exports = dataRoutes;

