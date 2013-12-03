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
            this.listenTo(this.model, 'sync', this.render);
        },
        render: function() {
            // compile the template into handlebars
            var compiledTemplate = Handlebars.compile(this.template);

            // combine the model data into the compiled template
            var renderedTemplate = compiledTemplate(this.model.attributes);

            // set the element's HTML to the rendered template
            this.$el.html( renderedTemplate );

            // empty out the page element, and set its HTML to the view's HTML
            $('#mailchimp').empty().html( this.el );
            // console.log('rendering');
            return this;
        }
    });

    return MailchimpView;

});
