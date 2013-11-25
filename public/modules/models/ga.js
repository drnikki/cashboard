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
        url : 'http://localhost:3000/data/ga',
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
