var request = require('request');

describe("a test", function() {

    it("should respond with hello world", function(done) {
        request("http://localhost:3000/", function(error, response, body ){
            expect(body).toContain('Express');
            done();
        });
    });

})