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

    var MailchimpModel = require('modules/models/mailchimp');
    var MailchimpView = require('modules/views/mailchimp');

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
