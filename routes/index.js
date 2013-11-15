
/*
 * GET home page.
 */

var db = require("../database.js");

exports.index = function(req, res){

    db.testcol.find(function(err, data) {
        if(err) return;

        var alldata = JSON.stringify(data);
        res.render("index", {
            foo: alldata
        });
    });
};
