// get all configs
var config = require('../config');

// holds all the routes
var dataRoutes = {};

// ------------------------------------------------------------------------- //
// Handle incoming routes
// ------------------------------------------------------------------------- //

dataRoutes.dataRouter = function(req, res) {

    var provider = req.params.provider;

    // if we have a handler for that url
    if ( dataRoutes.hasOwnProperty(provider) ) {

        dataRoutes[provider](req,res);

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

};


// ------------------------------------------------------------------------- //
// Google
// ------------------------------------------------------------------------- //

dataRoutes.ga = function(req, res){

    var GA = require('googleanalytics');
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
            // return JSON
            // also its an array and I don't want that, so [0]
            res.json(entries[0]);
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

    //https://api.instagram.com/v1/users/238670333?client_id=1e9035d6965a4353a1727f963902f2bf
    Instagram.users.info({
        user_id: config.instagram.user_id,
        complete : function(data) {
            res.json(data);
        }
    });



};

// ------------------------------------------------------------------------- //
// Twitter
// ------------------------------------------------------------------------- //

dataRoutes.twitter = function(req, res){

    res.json('twitter');

};

// ------------------------------------------------------------------------- //
// Mailchimp
// ------------------------------------------------------------------------- //

dataRoutes.mailchimp = function(req, res){

    res.json('mailchimp');

};

// ------------------------------------------------------------------------- //
// Export
// ------------------------------------------------------------------------- //
module.exports = dataRoutes;