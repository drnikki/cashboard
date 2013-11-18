define(function(require) {

    var Backbone = require('backbone');
    var FooView = require('modules/views/foo');

    var FooCollectionView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, "reset", this.render);
        },
        tagName: "ul",
        className: "books",
        render: function() {
            this.$el.html("");
            this.collection.each(function(foo) {
                var fooView = new FooView({ model: foo });
                this.$el.append(fooView.render().el);
            }, this);
            return this;
        }
    });

    return FooCollectionView;
});
