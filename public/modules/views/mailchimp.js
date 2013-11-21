// ************************************************************************* //
// ========================================================================= //
//
// Mailchimp VIEW
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');
    var $ = require('jquery');
    var Events = require('events');
    var Handlebars = require('handlebars');

    var MailchimpTemplate = require('text!viewsPath/mailchimp.html');

    var MailchimpView = Backbone.View.extend({
        template : MailchimpTemplate,
        className : 'mailchimp-container',
        initialize: function(options) {
            // Re-render when the model changes
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log( this.model.attributes );
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            $('#mailchimp').empty().html( this.el );
            console.log('rendering');
            return this;
        }
    });

    return MailchimpView;

});
