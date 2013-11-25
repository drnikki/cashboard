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
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            // console.log( this.model.attributes );
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            $('#ga').empty().html( this.el );
            // console.log('rendering');

            return this;
        }
    });

    return GaView;

});
