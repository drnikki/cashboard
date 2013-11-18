define(function(require) {

    var Backbone = require('backbone');
    var FooModel = require('../models/foo');

    var FooCollection = Backbone.Collection.extend({
        model: FooModel,
        url: "/"
    });

    return FooCollection;
});
