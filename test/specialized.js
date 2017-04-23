require('chai').should();
const Vndb = require('../src/Vndb.js')

const vndb = new Vndb({
  clientName: 'vndbjs-test',
  pool: true,
  poolMin: 0,
  poolMax: 2,
  parse: true
});

describe('Specialized ', function() {

  describe('Large data sets', function() {
    it('Should return a complete chunk of data', function() {
      return vndb
      .query('get vn basic,details,stats,tags,anime,relations,screens (title ~ "no") { "results": 20 }')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const vn = response.items[17];
        vn.should.have.property('title');
        vn.should.have.property('original');
        vn.should.have.property('length');
        vn.should.have.property('aliases');
        vn.should.have.property('relations');
        vn.should.have.property('tags');
      });
    });
  });

  describe('Sorting', function() {
    it('Should return Muv-Luv Alternative', function() {
      return vndb
      .query('get vn basic,details,stats (title ~ "Muv-Luv") { "results": 1, "sort": "rating", "reverse": true }')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const vn = response.items[0];
        vn.should.have.property('title');
        vn.should.have.property('id', 92);
        vn.should.have.property('original');
        vn.should.have.property('length');
        vn.should.have.property('aliases');
      });
    });
  });

  describe('Empty Results', function() {
    it('Should return empty results', function() {
      return vndb
      .query('get vn basic,details,stats (title ~ "fhqwhgads")')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.items.should.be.a('array');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');
      });
    });
  });

  describe('Complicated filters', function() {
    it('Should return valid results', function() {
      return vndb
      .query('get vn basic,details,stats ((platforms = ["win", "ps2"] or languages = "ja") and released > "2009-01-10")')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.items.should.be.a('array');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const vn = response.items[0];
        vn.should.have.property('title');
        vn.should.have.property('id');
        vn.should.have.property('original');
        vn.should.have.property('length');
        vn.should.have.property('aliases');
      });
    });
  });
});
