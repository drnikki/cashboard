// ************************************************************************* //
// ========================================================================= //
//
// Instagram VIEW
//
// ========================================================================= //
// ************************************************************************* //

define(function(require) {

    var Backbone = require('backbone');
    var $ = require('jquery');
    var Events = require('events');
    var Handlebars = require('handlebars');

    var InstagramTemplate = require('text!viewsPath/instagram.html');

    var InstagramView = Backbone.View.extend({
        template : InstagramTemplate,
        className : 'instagram-container',
        initialize: function(options) {
            // Re-render when the model changes
            this.listenTo(this.model, "sync", this.render);
        },
        render: function() {
            var compiled = Handlebars.compile(this.template);
            console.log( this.model.attributes );
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            $('#instagram').empty().html( this.el );
            console.log('rendering');
            return this;
        }
    });

    return InstagramView;

});
