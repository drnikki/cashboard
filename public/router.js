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

    var GaModel = require('modules/models/ga');
    var GaView = require('modules/views/ga');

    // Defining the application router.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index",
            "other": "other"
        },

        index: function() {

            // @TODO embed starting JSON in the template in a script tag?

            // big mess of get everything!

            // test
            $.ajax({
                url: '/data/foos'
            })
            .done(function(data) {

                // populate the collection with the JSON
                fooCollection = new FooCollection( data );
                // make a new view with the collection
                var view = new FooCollectionView({ collection: fooCollection });
                view.render();

                // add the collection element to the body
                $('body').append(view.el);

            });

            // google analytics

            // autofetches. Good idea?
            ga = new GaModel();
            gaView = new GaView({model : ga});

            //$('body').append( gaView.render().el );


            /*
            $.ajax({
                url: '/data/ga'
            })
            .done(function(data) {

                console.log(data);

                // populate the collection with the JSON
                // var fooCollection = new FooCollection( data );
                // make a new view with the collection
                // var view = new FooCollectionView({ collection: fooCollection });
                // var viewEl = view.render().el;

                // add the collection element to the body
                // $('body').append(viewEl);

            });
            */

            // twitter

            // mail chimp



        },

        other : function() {
            alert('other!');
        }
    });

    return Router;

});
