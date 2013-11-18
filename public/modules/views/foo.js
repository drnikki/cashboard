define(function(require, exports, module) {

    var Backbone = require('backbone');
    var $ = require('jquery');
    var Events = require('events');

    var Handlebars = require('handlebars');

    var template = require('text!viewsPath/foo.html');

    var BookView = Backbone.View.extend({
        events: {
            "click .name": "singleBookLink"
        },
        tagName: "li",
        className: "book",
        render: function() {
            var compiled = Handlebars.compile(template);
            var html = compiled(this.model.attributes);
            this.$el.html(html);
            console.log('rendering');
            return this;
        },
        singleBookLink: function(e) {
            e.preventDefault();
            var id = this.model.get("_id");
            var url = "book/" + id;
            Events.trigger("router:navigate", url);
        }
    });

    // exports.module = BookView

    return BookView;

});
