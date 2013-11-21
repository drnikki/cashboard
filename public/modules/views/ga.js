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

    // var template = require('text!viewsPath/foo.html');
    var template = '<p>{{data}}</p>';

    var GaView = Backbone.View.extend({
        events: {

        },
        tagName: 'div',
        className : 'ga-container',
        initialize: function(options) {
            // Re-render when the model changes
            // this.model.on('change', this.render, this);
            this.listenTo(this.model, "change sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(template);
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            console.log('rendering');
            return this;
        }
    });

    return GaView;

});
