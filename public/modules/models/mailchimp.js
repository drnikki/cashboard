// ************************************************************************* //
// ========================================================================= //
//
// Mailchimp MODEL
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');

    var MailchimpModel = Backbone.Model.extend({
        url : 'http://localhost:3000/data/mailchimp',
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

    return MailchimpModel;
});
