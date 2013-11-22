(function(window) {
    "use strict";

    var karma = window.__karma__;

    // Put Karma into an asynchronous waiting mode until we have loaded our
    // tests.
    karma.loaded = function() {};

    // Set the application endpoint and load the configuration.
    require.config({
        paths: {
            underscore: "vendor/bower/lodash/dist/lodash.underscore",
            jquery: "vendor/bower/jquery/jquery.min"
        },

        baseUrl: "base/public"
    });

    require([
        "config",
        "underscore"
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
