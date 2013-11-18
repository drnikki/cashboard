define(function(require) {

    var Backbone = require('backbone');

    var Book = Backbone.Model.extend({
        // because Mongo uses _id
        idAttribute: "_id"
    });

    return Book;
});
