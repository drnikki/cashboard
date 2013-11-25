// ************************************************************************* //
// ========================================================================= //
//
// Google Analytics testing
//
// ========================================================================= //
// ************************************************************************* //


define(function(require) {

    var GaModel = require('GaModel');
    var GaView = require('GaView');

    describe("GaView", function() {

        it("should have a template", function() {

            var gaView = new GaView({ model : new GaModel() })
            expect(gaView.template).toBeDefined();
        });

        it("fetch/sync should be triggered", function() {

            var ga = new GaModel();
            var gaView = new GaView({ model : ga })

            var syncFlag = false;

            ga.on('sync', function(event) {
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
