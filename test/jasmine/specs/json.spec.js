// ************************************************************************* //
// ========================================================================= //
//
// JSON Endpoint testing
//
// Checks each data/[provider] urls for a success callback
//
// ========================================================================= //
// ************************************************************************* //



define(function(require) {

    var $ = require('jquery');

    describe("JSON endpoints: ", function() {

        // stores a generic callback
        var callbacks;

        function makeAjaxCall(url) {
            $.ajax({
                url: url,
                success: callbacks.success,
                error : callbacks.error
            });
        }

        beforeEach(function() {

            callbacks = {
                success : function(error) {
                    console.log('callback success');
                },
                error : function(error) {
                    console.log('callback error', error);
                }
            }

        })

        // ------------------------------------------------------------------------- //
        // Google
        // ------------------------------------------------------------------------- //

        it("Google data should succeed", function() {

            spyOn(callbacks, 'success');

            makeAjaxCall('http://localhost:3000/data/ga');

            waitsFor(function() {
                return callbacks.success.callCount > 0;
            }, "The Ajax call timed out.", 10000);

            runs(function() {
                expect(callbacks.success).toHaveBeenCalled();
            });

        });



        // ------------------------------------------------------------------------- //
        // Twitter
        // ------------------------------------------------------------------------- //

        it("Twitter data should succeed", function() {

            spyOn(callbacks, 'success');

            makeAjaxCall('http://localhost:3000/data/twitter');

            waitsFor(function() {
                return callbacks.success.callCount > 0;
            }, "The Ajax call timed out.", 10000);

            runs(function() {
                expect(callbacks.success).toHaveBeenCalled();
            });

        });



        // ------------------------------------------------------------------------- //
        // Instram
        // ------------------------------------------------------------------------- //

        it("Instagram data should succeed", function() {

            spyOn(callbacks, 'success');

            makeAjaxCall('http://localhost:3000/data/instagram');

            waitsFor(function() {
                return callbacks.success.callCount > 0;
            }, "The Ajax call timed out.", 10000);

            runs(function() {
                expect(callbacks.success).toHaveBeenCalled();
            });

        });



        // ------------------------------------------------------------------------- //
        // Mail Chimp
        // ------------------------------------------------------------------------- //

        it("Mail Chimp data should succeed", function() {

            spyOn(callbacks, 'success');

            makeAjaxCall('http://localhost:3000/data/mailchimp');

            waitsFor(function() {
                return callbacks.success.callCount > 0;
            }, "The Ajax call timed out.", 10000);

            runs(function() {
                expect(callbacks.success).toHaveBeenCalled();
            });

        });

    })

});
