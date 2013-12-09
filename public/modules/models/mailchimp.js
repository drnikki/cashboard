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
        // these are the same URLs that are defined in /routes/data.js
        url : '/data/mailchimp',
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
