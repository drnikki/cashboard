// ************************************************************************* //
// ========================================================================= //
//
// Global Events
//
// creates an empty object which is used to trigger global events
//
// ========================================================================= //
// ************************************************************************* //


define(function(require, exports, module) {

    var _ = require('underscore');
    var Backbone = require('backbone');

    var o = {};
    _.extend(o, Backbone.Events);

    return o;

});
