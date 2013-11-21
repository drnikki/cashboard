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
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log( this.model.attributes );
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            $('#twitter').empty().html( this.el );
            console.log('rendering');
            return this;
        }
    });

    return TwitterView;

});