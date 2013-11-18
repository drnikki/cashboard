define(function(require) {

    // External dependencies.
    var Backbone = require("backbone");
    var $ = require('jquery');

    var FooModel = require('modules/models/foo');
    var FooView = require('modules/views/foo');
    var FooCollection = require('modules/collections/foo');
    var FooCollectionView = require('modules/views/fooCollection');

    // Defining the application router.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index",
            "other": "other"
        },

        index: function() {

            $.ajax({
                url: '/data/foos',
                data : 'JSON'
            })
            .done(function(data) {

                var fooCollection = new FooCollection( data );

                var view = new FooCollectionView({ collection: fooCollection });

                var viewEl = view.render().el;

                $('body').append(viewEl);

            });

        },

        other : function() {
            alert('other!');
        }
    });

    return Router;

});
