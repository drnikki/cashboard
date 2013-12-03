// ************************************************************************* //
// ========================================================================= //
//
// Google Analytics VIEW
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');
    var $ = require('jquery');
    var Events = require('events');
    var Handlebars = require('handlebars');

    var GaTemplate = require('text!viewsPath/ga.html');

    var GaView = Backbone.View.extend({
        template : GaTemplate,
        className : 'ga-container',
        initialize: function(options) {
            // Re-render when the model changes
            // this.model.on('change', this.render, this);
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
            $('#ga').empty().html( this.el );

            return this;
        }
    });

    return GaView;

});
