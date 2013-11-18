define(function(require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var $ = require('jquery');

    var FooModel = require('modules/models/foo');
    var FooView = require('modules/views/foo');
    var FooCollection = require('modules/collections/foo');
    var FooCollectionView = require('modules/views/fooCollection');

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        routes: {
            "": "index",
            "other": "other"
        },

        index: function() {
            console.log("Welcome to your / route.");

            var data = $("#fooData").html();
            var fooCollection = new FooCollection(JSON.parse(data));

            var view = new FooCollectionView({ collection: fooCollection });

            var viewEl = view.render().el;

            $('body').append(viewEl);

        },

        other : function() {
            alert('other!');
        }
    });
});
