

exports.ga = function(req, res){

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

};