// ************************************************************************* //
// ========================================================================= //
//
// Twitter VIEW
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');
    var $ = require('jquery');
    var Events = require('events');
    var Handlebars = require('handlebars');

    var TwitterTemplate = require('text!viewsPath/twitter.html');

    var TwitterView = Backbone.View.extend({
        template : TwitterTemplate,
        className : 'twitter-container',
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
            $('#twitter').empty().html( this.el );

            return this;
        }
    });

    return TwitterView;

});
