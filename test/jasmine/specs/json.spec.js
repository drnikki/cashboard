define(function(require) {

    var $ = require('jquery');

    describe("JSON endpoints: ", function() {

        it("Google shouldn't 404", function(done) {

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
            /*

            var callback = jasmine.createSpy();

            makeAjaxCall(callback);

            waitsFor(function() {
                return callback.callCount > 0;
            }, "The Ajax call timed out.", 5000);

            runs(function() {
                expect(callback).toHaveBeenCalled();
            });

            function makeAjaxCall(callback) {
                $.ajax({
                    type: "GET",
                    url: "data.json",
                    contentType: "application/json; charset=utf-8"
                    dataType: "json",
                    success: callback
                });
            }
            */


        });

    })

});
