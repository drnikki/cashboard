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

    // var FooCollection = require('modules/collections/foo');
    // var FooCollectionView = require('modules/views/fooCollection');

    var GaModel = require('modules/models/ga');
    var GaView = require('modules/views/ga');

    var TwitterModel = require('modules/models/twitter');
    var TwitterView = require('modules/views/twitter');

    var InstagramModel = require('modules/models/instagram');
    var InstagramView = require('modules/views/instagram');

    // Defining the application router.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index",
            "other": "other"
        },

        index: function() {

            // @TODO embed starting JSON in the template in a script tag?

            // google analytics

            // autofetches. Good idea?
            var ga = new GaModel();
            var gaView = new GaView({ model : ga });


            // twitter
            var twitter = new TwitterModel();
            var twitterView = new TwitterView({ model : twitter });

            // mail chimp


            // instagram
            var instagram = new InstagramModel();
            var instagramView = new InstagramView({ model : instagram });

        },

        other : function() {
            alert('other!');
        }
    });

    return Router;

});
