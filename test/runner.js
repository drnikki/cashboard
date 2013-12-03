(function(window) {

    var karma = window.__karma__;

    // Put Karma into an asynchronous waiting mode until we have loaded our
    // tests.
    karma.loaded = function() {};

    // Set the application endpoint and load the configuration.
    require.config({

        baseUrl: 'base/public',

        paths: {
            'underscore': 'vendor/bower/lodash/dist/lodash.underscore',
            'jquery': 'vendor/bower/jquery/jquery.min',

            // Map remaining vendor dependencies
            'backbone' : 'vendor/bower/backbone/backbone',
            'text' : 'vendor/lib/require.text',
            'handlebars' : 'vendor/lib/handlebars',

            // Templates path
            'viewsPath' : 'modules/views',

            // modules
            'events' : 'modules/events',

            // google
            'GaModel' : 'modules/models/ga',
            'GaView' : 'modules/views/ga',

            // twitter
            'TwitterModel' : 'modules/models/twitter',
            'TwitterView' : 'modules/views/twitter',

            // instagram
            'InstagramModel' : 'modules/models/instagram',
            'InstagramView' : 'modules/views/instagram',

            // mailchimp
            'MailchimpModel' : 'modules/models/mailchimp',
            'MailchimpView' : 'modules/views/mailchimp'

        },

        shim: {
            // This is required to ensure Backbone works as expected within the AMD
            // environment.
            "backbone": {
                // These are the two hard dependencies that will be loaded first.
                deps: ["jquery", "underscore"],

                // This maps the global `Backbone` object to `require("backbone")`.
                exports: "Backbone"
            },
            'handlebars': {
                exports: 'Handlebars'
            }
        }
    });

    require([
        'config',
        'underscore'
    ],
    function(config, _) {
        var specs = _.chain(karma.files)
            // Convert the files object to an array of file paths.
            .map(function(id, file) {
                return file;
            })
            // Tests that end with `.spec.js' and existing either `app` or `test`
            // directories are automatically loaded.
            .filter(function(file) {
                return (/^\/base\/(public|test)\/.*\.spec\.js$/).test(file);
            })
            .value();

        // Load all specs and start Karma.
        require(specs, karma.start);
    });

})(this);
