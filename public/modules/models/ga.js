// ************************************************************************* //
// ========================================================================= //
//
// Google Analytics MODEL
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');

    var GaModel = Backbone.Model.extend({
        // these are the same URLs that are defined in /routes/data.js
        url : '/data/ga',
        initialize : function() {
            // autofetch?
            this.fetch();
        },
        /*
        // if you want to do custom JSON parsing
        parse : function( response, options) {
            return response;
        }
        */
    });

    return GaModel;
});
