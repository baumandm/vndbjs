var should = require('chai').should();
var _vndb = require('../vndb.js');
var vndb = new _vndb("vndbtestprocess");

describe("query", function() {
  this.timeout(5000);
  it("Should succeed and return JSON object of results", function(done) {
    vndb.query("dbstats").then( function(resolve) {
      resolve.should.be.a('object');
      resolve.should.have.property('users');
      done();
    }).catch(function (error) {
      done(error);
    });
  });
  it("Should fail and do stuff", function(done) {
    vndb.query("get vn fd").then( function(resolve) {
      done("Expected an error");
    }, function(reject) {
      reject.should.be.a('string');
      //reject.should.equal('error');
      done();
    });
  });
});

describe("get", function() {
  it("Should succeed and return details on a VN", function(done) {
    vndb.get({type:"vn", flags:["basic", "details"], filter:['id = 17']}).then( function(resolve) {
      resolve.should.be.a('object');
      resolve.should.have.property('items');
      resolve.items.should.have.length(1);
      let item = resolve.items[0];
      item.should.have.property('title');
      item.should.have.property('description');
      item.should.not.have.property('rating');
      done();
    }).catch(function(error) {
      done(error);
    });
  });
  it("Should fail and return 'invalid query'", function(done) {
    vndb.get({}).then( function(resolve) {
      done("Expected an error");
    }, function(reject) {
      reject.should.be.a('string');
      //reject.should.equal('Invalid query.');
      done();
    });
  });
});

describe("stats", function() {
  it("Should succeed and return JSON", function(done) {
    vndb.stats().then( function(resolve) {
      resolve.should.be.a('object');
      resolve.should.have.property('users');
      resolve.should.have.property('vn');
      resolve.should.have.property('chars');
      done();
    }).catch(function(error) {
      done(error);
    });
  });
});
