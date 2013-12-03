// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
    paths: {

        // Almond is used to lighten the output filesize
        "almond": "vendor/bower/almond/almond",

        // Opt for Lo-Dash Underscore compatibility build over Underscore
        "underscore": "vendor/bower/lodash/dist/lodash.underscore",

        // Map remaining vendor dependencies
        "jquery": "vendor/bower/jquery/jquery",
        "backbone": "vendor/bower/backbone/backbone",
        "text" : "vendor/lib/require.text",
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
        'MailchimpView' : 'modules/views/mailchimp',

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
