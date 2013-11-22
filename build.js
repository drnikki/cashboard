({
    mainConfigFile: 'public/config.js',

    // name of modules to process, using the path above
    name : 'main',
    // output name of the file
    out : 'public/dist/main.build.js',

    // uglify settings
    uglify: {
        beautify: true,
        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle: true
    },

    // kill comments
    preserveLicenseComments: false,
    // wrap in an IIFE
    // wrap: true,
    logLevel: 1,

    findNestedDependencies: true

})
