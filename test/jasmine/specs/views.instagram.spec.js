// ************************************************************************* //
// ========================================================================= //
//
// Instagram testing
//
// ========================================================================= //
// ************************************************************************* //


define(function(require) {

    var InstagramModel = require('InstagramModel');
    var InstagramView = require('InstagramView');

    describe("InstagramView", function() {

        it("should have a template", function() {

            var instagramView = new InstagramView({ model : new InstagramModel() })
            expect(instagramView.template).toBeDefined();
        });

        it("fetch/sync should be triggered", function() {

            var insta = new InstagramModel();
            var instaView = new InstagramView({ model : insta })

            var syncFlag = false;

            insta.on('sync', function(event) {
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
