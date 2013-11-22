define(function(require) {

    var $ = require('jquery');

    describe("JSON endpoints: ", function() {

        it("Google shouldn't 404", function() {

            /*
            $.ajax({
                url: 'localhost:3000/data/ga',
                complete: function(xhr, textStatus) {
                },
                success: function(data, textStatus, xhr) {
                },
                error: function(xhr, textStatus, errorThrown) {
                }
            });

            waitsFor

            runs(function() {
                expect(callback).toHaveBeenCalled();
            });

            */


            var callbacks = {
                success : function(error) {
                    console.log('callback success');
                },
                error : function(error) {
                    console.log('callback error');
                }
            }

            spyOn(callbacks, 'success');

            function makeAjaxCall() {
                $.ajax({
                    url: "http://localhost:3000/data/ga",
                    success: callbacks.success,
                    error : callbacks.error
                });
            }

            makeAjaxCall();

            waitsFor(function() {
                return callbacks.success.callCount > 0;
            }, "The Ajax call timed out.", 10000);

            runs(function() {
                expect(callbacks.success).toHaveBeenCalled();
            });

        });

    })

});
