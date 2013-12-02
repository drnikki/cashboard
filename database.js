// ************************************************************************* //
// ========================================================================= //
//
// Database
//
// connects to mongo DB
//
// ========================================================================= //
// ************************************************************************* //

var dbUrl = 'cashboard';
var collections = [
    'twitter',
    'google'
];

var db = require('mongojs').connect(dbUrl, collections);
module.exports = db;
