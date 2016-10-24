var should = require('chai').should();

var _vndb = require('../vndb.js');
var vndb = new _vndb("vndbtestprocess");

describe("vndb.query", function() {
    it("Should succeed and return JSON object of results", function() {
        vndb.query("dbstats").then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('users');
            resolve.should.have.length(9);
        });
    })
    it("Should fail and do stuff", function() {
        vndb.query("get vn fd").then( function(resolve) {
        }, function(reject) {
            //console.log(reject);
        })
    })
});

describe("vndb.get", function() {
    it("Should suceed and return details on a VN", function() {
        vndb.get({type:"vn", flags:["basic", "details"], filter:{type:"id", oper:"=", value:"17"}}).then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('title');
            resolve.should.have.property('description');
            resolve.should.have.property('rating');
        });
    })
    it("Should fail and return 'invalid query'", function() {
        vndb.get({}).then( function(resolve) {
        }, function(reject) {
            reject.should.be.a('string');
            reject.should.equal('Invalid query.');
        });
    })
})
