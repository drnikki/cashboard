// ************************************************************************* //
// ========================================================================= //
//
// Mail Chimp testing
//
// ========================================================================= //
// ************************************************************************* //


define(function(require) {

    var MailchimpModel = require('MailchimpModel');
    var MailchimpView = require('MailchimpView');

    describe("MailchimpView", function() {

        it("should have a template", function() {

            var mailchimpView = new MailchimpView({ model : new MailchimpModel() })
            expect(mailchimpView.template).toBeDefined();
        });

        it("fetch/sync should be triggered", function() {

            var mailchimp = new MailchimpModel();
            var mailchimpView = new MailchimpView({ model : mailchimp })

            var syncFlag = false;

            mailchimp.on('sync', function(event) {
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
