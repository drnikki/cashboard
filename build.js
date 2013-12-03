// ************************************************************************* //
// ========================================================================= //
//
// Build config
//
// used in r.js builds
//
// ========================================================================= //
// ************************************************************************* //

({
    mainConfigFile: 'public/config.js',

    // name of modules to process, using the path above
    name : 'main',
    // output name of the file
    out : 'public/dist/main.build.js',

    // uglify settings
    uglify: {
        // reformat into prettiness. Useful for debugging.
        beautify: false,
        // obfuscate code. Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle: false
    },

    // kill comments
    preserveLicenseComments: false,

    // wrap in an IIFE
    wrap: true,

    // logging level
    // logLevel: 1,

    // if using the sugar syntax, you must find nested dependencies. Keep true.
    findNestedDependencies: true

})
