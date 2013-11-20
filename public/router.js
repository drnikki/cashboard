// ************************************************************************* //
// ========================================================================= //
//
// BACKBONE Router
//
// ========================================================================= //
// ************************************************************************* //


define(function(require) {

    // External dependencies.
    var Backbone = require("backbone");
    var $ = require('jquery');

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
                url: '/data/foos'
            })
            .done(function(data) {

                // populate the collection with the JSON
                var fooCollection = new FooCollection( data );
                // make a new view with the collection
                var view = new FooCollectionView({ collection: fooCollection });
                var viewEl = view.render().el;

                // add the collection element to the body
                $('body').append(viewEl);

            });

        },

        other : function() {
            alert('other!');
        }
    });

    return Router;

});
