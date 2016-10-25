var should = require('chai').should();

var _vndb = require('../vndb.js');
var vndb = new _vndb("vndbtestprocess");

describe("query", function() {
    it("Should succeed and return JSON object of results", function() {
        vndb.query("dbstats").then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('users');
            resolve.should.have.length(9);
        });
    });
    it("Should fail and do stuff", function() {
        vndb.query("get vn fd").then( function(resolve) {
        }, function(reject) {
            reject.should.be.a('string');
            reject.should.equal('error');
        });
    });
});

describe("get", function() {
    it("Should succeed and return details on a VN", function() {
        vndb.get({type:"vn", flags:["basic", "details"], filter:{type:"id", oper:"=", value:"17"}}).then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('title');
            resolve.should.have.property('description');
            resolve.should.have.property('rating');
        });
    });
    it("Should fail and return 'invalid query'", function() {
        vndb.get({}).then( function(resolve) {
        }, function(reject) {
            reject.should.be.a('string');
            reject.should.equal('Invalid query.');
        });
    });
});

describe("stats", function() {
    it("Should succeed and return JSON", function() {
        vndb.stats().then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('users');
            resolve.should.have.property('vn');
            resolve.should.have.property('chars');
        });
    });
});

describe("searchVnList", function() {
    it("Should succeed and return JSON", function() {
        vndb.searchVnList("muv luv").then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('num');
            resolve.should.have.property('more');
            resolve.should.have.property('items');
            resolve.items[0].should.have.property('title');
        });
    });
});

describe("getVnByTitleFull", function() {
    it("Should succeed and return JSON", function() {
        vndb.getVnByTitleFull("Muv-Luv").then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('tags');
            resolve.should.have.property('relations');
            resolve.should.have.property('anime');
        });
    });
});

describe("getVnByTitle", function() {
    it("Should succeed and return JSON", function() {
        vndb.getVnByTitle("Muv-Luv").then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('image');
            resolve.should.have.property('rating');
            resolve.should.have.property('length');
        });
    });
})
;
describe("getVnByIdFull", function() {
    it("Should succeed and return JSON", function() {
        vndb.getVnByIdFull(17).then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('tags');
            resolve.should.have.property('relations');
            resolve.should.have.property('anime');
        });
    });
});

describe("getVnById", function() {
    it("Should succeed and return JSON", function() {
        vndb.getVnById(17).then( function(resolve) {
            resolve.should.be.a('object');
            resolve.should.have.property('image');
            resolve.should.have.property('rating');
            resolve.should.have.property('length');
        });
    });
});
