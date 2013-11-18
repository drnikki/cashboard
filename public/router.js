define(function(require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var template = require('text!viewsPath/book.html');

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        routes: {
            "": "index",
            "other": "other"
        },

        index: function() {
            console.log("Welcome to your / route.");
        },

        other : function() {
            alert('other!');
        }
    });
});
