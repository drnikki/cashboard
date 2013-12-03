var dataRoutes = {};

// ------------------------------------------------------------------------- //
// Google Analytics
// ------------------------------------------------------------------------- //

var GA = require('googleanalytics'),
    util = require('util'),
    config = {
        "user": "myusername",
        "password": "mypassword"
    },
    ga = new GA.GA(config);

     var options = {
    'ids': 'ga:<profileid>',
    'start-date': '2010-09-01',
    'end-date': '2010-09-30',
    'dimensions': 'ga:pagePath',
    'metrics': 'ga:pageviews',
    'sort': '-ga:pagePath'
};

ga.get(options, function(err, entries) {
    util.debug(JSON.stringify(entries));
});