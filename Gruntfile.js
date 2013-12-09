// ************************************************************************* //
// ========================================================================= //
//
// Gruntfile
//
// used in grunt automation
// run 'npm install' to get all the dependencies set up.
//
// main tasks:
//   jshint : jshint all js
//   requirejs : r.js optimize the modules into a single file
//   test : single run of all the tests
//   karma:d : karma daemon, runs all tests on each file save
//
// ========================================================================= //
// ************************************************************************* //


module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        // Wipe out previous builds and test reporting.
        clean: ["dist/", "test/reports"],

        // Run your source code through JSHint's defaults.
        jshint: ["**/*.js"],

        // This task uses James Burke's excellent r.js AMD builder to take all
        // modules and concatenate them into a single file.
        requirejs: {
            release: {
                options: {
                    mainConfigFile: "public/config.js",
                    generateSourceMaps: true,
                    include: ["main"],
                    insertRequire: ["main"],
                    out: "public/dist/source.min.js",
                    optimize: "uglify2",

                    // Since we bootstrap with nested `require` calls this option allows
                    // R.js to find them.
                    findNestedDependencies: true,

                    // Include a minimal AMD implementation shim.
                    name: "almond",

                    // Setting the base url to the distribution directory allows the
                    // Uglify minification process to correctly map paths for Source
                    // Maps.
                    baseUrl: "public/dist",

                    // Wrap everything in an IIFE.
                    wrap: true,

                    // Do not preserve any license comments when working with source
                    // maps.  These options are incompatible.
                    preserveLicenseComments: false
                }
            }
        },

        // This task simplifies working with CSS inside Backbone Boilerplate
        // projects.  Instead of manually specifying your stylesheets inside the
        // HTML, you can use `@imports` and this task will concatenate only those
        // paths.
        styles: {
            // Out the concatenated contents of the following styles into the below
            // development file path.
            "dist/styles/css/styles.css": {
                // Point this to where your `index.css` file is location.
                src: "public/styles/css/index.css",

                // The relative path to use for the @imports.
                paths: ["public/styles"],

                // Rewrite image paths during release to be relative to the `img`
                // directory.
                forceRelative: "/public/img/"
            }
        },

        // Minfiy the distribution CSS.
        cssmin: {
            release: {
                files: {
                    "dist/styles/css/styles.min.css": ["dist/styles/css/styles.css"]
                }
            }
        },

        server: {
            options: {
                host: "0.0.0.0",
                port: 8000
            },

            development: {},

            release: {
                options: {
                    prefix: "dist"
                }
            },

            test: {
                options: {
                    forever: false,
                    port: 8001
                }
            }
        },

        /*
        processhtml: {
            release: {
                files: {
                    "dist/index.html": ["index.html"]
                }
            }
        },
        */

        // Move vendor and app logic during a build.
        copy: {
            release: {
                files: [
                    {
                        src: ["public/**"],
                        dest: "dist/"
                    }
                ]
            }
        },

        // Unit testing is provided by Karma.  Change the two commented locations
        // below to either: mocha, jasmine, or qunit.
        karma: {
            options: {
                basePath: process.cwd(),
                singleRun: true,
                captureTimeout: 7000,
                autoWatch: true,

                reporters: ["progress", "coverage"],
                browsers: [
                    // "PhantomJS",
                    "Chrome"
                ],

                // Change this to the framework you want to use.
                frameworks: ["jasmine"],

                plugins: [
                    "karma-jasmine",
                    "karma-phantomjs-launcher",
                    "karma-chrome-launcher",
                    "karma-coverage"
                ],

                // this should not process libraries or vendor scripts

                preprocessors: {
                    // "public/**.js": "coverage"
                },


                coverageReporter: {
                    type: "lcov",
                    dir: "test/coverage"
                },

                files: [
                    // You can optionally remove this or swap out for a different expect.
                    "public/vendor/bower/requirejs/require.js",
                    "test/runner.js",
                    {
                          pattern: "public/**/*.*",
                          included: false
                    },
                    // Derives test framework from Karma configuration.
                    {
                        pattern: "test/<%= karma.options.frameworks[0] %>/**/*.spec.js",
                        included: false
                    },
                    {
                        pattern: "public/vendor/**/*.js",
                        included: false
                    }
                ]
            },

            // This creates a server that will automatically run your tests when you
            // save a file and display results in the terminal.
            d: {
                options: {
                    singleRun: false
                }
            },

            // This is useful for running the tests just once.
            run: {
                options: {
                    singleRun: true
                }
            }
        },

        // develop lets us launch our node app for testing
        develop: {
            nodeApp: {
                file: 'app.js',
                cmd: 'node'
                // nodeArgs: ['--debug'],            // optional
                // args: ['appArg1', 'appArg2']      // optional
                // env: { NODE_ENV: 'development'}  // optional
            }
            // @TODO add mongo starting
            /*
            mongo: {

            }
            */
        },

        coveralls: {
            options: {
                coverage_dir: "test/coverage/PhantomJS 1.9.2 (Linux)/"
            }
        }
    });

    // Grunt contribution tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-copy");

    // Third-party tasks.
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-karma-coveralls");
    grunt.loadNpmTasks("grunt-processhtml");

    // so we can run the node.js app on test
    grunt.loadNpmTasks('grunt-develop');

    // Grunt BBB tasks.
    grunt.loadNpmTasks("grunt-bbb-server");
    grunt.loadNpmTasks("grunt-bbb-requirejs");
    grunt.loadNpmTasks("grunt-bbb-styles");

    // Create an aliased test task.
    grunt.registerTask("test", [
        'develop',
        "karma:run"
    ]);

    // When running the default Grunt command, just lint the code.
    grunt.registerTask("default", [
        "clean",
        "jshint",
        "processhtml",
        "copy",
        "requirejs",
        "styles",
        "cssmin"
    ]);
};
