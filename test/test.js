var should = require('chai').should();

var _vndb = require('../vndb.js');
var vndb = new _vndb("vndbtestprocess");

describe("vndb.query", function() {
    it("should return JSON object of results", function() {
        vndb.query("dbstats").then( (resolve) => {
            resolve.should.be.a('object');
            resolve.should.have.property('users');
            resolve.should.have.length(9);
        });
    })
});
