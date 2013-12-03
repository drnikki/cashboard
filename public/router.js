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

    var GaModel = require('GaModel');
    var GaView = require('GaView');

    var TwitterModel = require('TwitterModel');
    var TwitterView = require('TwitterView');

    var InstagramModel = require('InstagramModel');
    var InstagramView = require('InstagramView');

    var MailchimpModel = require('MailchimpModel');
    var MailchimpView = require('MailchimpView');

    // Defining the application router.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index"
        },

        index: function() {

            // @TODO embed starting JSON in the template in a script tag?
            // currently autofetches. Good idea?

            // google analytics
            var ga = new GaModel();
            var gaView = new GaView({ model : ga });

            // twitter
            var twitter = new TwitterModel();
            var twitterView = new TwitterView({ model : twitter });

            // mail chimp
            var mailchimp = new MailchimpModel();
            var mailchimpView = new MailchimpView({ model : mailchimp });

            // instagram
            var instagram = new InstagramModel();
            var instagramView = new InstagramView({ model : instagram });

        }

    });

    return Router;

});
