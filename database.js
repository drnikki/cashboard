// ************************************************************************* //
// ========================================================================= //
//
// Database
//
// connects to mongo DB
//
// ========================================================================= //
// ************************************************************************* //

// name of the mongo DB
var dbUrl = 'cashboard';
// names of the collections we want from that DB
var collections = [
    'twitter',
    'google',
    'instagram',
    'mailchimp'
];

// connect to mongo
var db = require('mongojs').connect(dbUrl, collections);

module.exports = db;
