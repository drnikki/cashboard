// ************************************************************************* //
// ========================================================================= //
//
// Twitter testing
//
// ========================================================================= //
// ************************************************************************* //


define(function(require) {

    var TwitterModel = require('TwitterModel');
    var TwitterView = require('TwitterView');

    describe("TwitterView", function() {

        it("should have a template", function() {

            var twitterView = new TwitterView({ model : new TwitterModel() })
            expect(twitterView.template).toBeDefined();
        });

        it("fetch/sync should be triggered", function() {

            var twitter = new TwitterModel();
            var twitterView = new TwitterView({ model : twitter })

            var syncFlag = false;

            twitter.on('sync', function(event) {
                syncFlag = true;
            });

            waitsFor(function() {
                return syncFlag === true;
            }, "render call timed out.", 10000);

            runs(function() {
                expect(syncFlag).toBe(true);
            });


        });

    });

})
