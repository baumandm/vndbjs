require('chai').should();
const Vndb = require('../src/Vndb.js')

const vndb = new Vndb({
  clientName: 'VNDBtest',
  pool: false,
  poolMin: 0,
  parse: true
});

describe('Pooled Mode - Parsing On', function() {
  describe('vndb.stats', function() {
    it('Should succeed and return JSON with results', function() {
      return vndb.stats().then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'dbstats');
        response.status.should.be.a('string');
        response.should.have.property('staff');
        response.should.have.property('tags');
        response.should.have.property('threads');
        response.should.have.property('traits');
        response.should.have.property('posts');
        response.should.have.property('users');
        response.should.have.property('releases');
        response.should.have.property('producers');
        response.should.have.property('vn');
        response.should.have.property('chars');
      });
    });
  });

  describe('vndb.query', function() {
    it('Should succeed and return JSON with results', function() {
      return vndb.query('dbstats').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'dbstats');
        response.status.should.be.a('string');
        response.should.have.property('staff');
        response.should.have.property('tags');
        response.should.have.property('threads');
        response.should.have.property('traits');
        response.should.have.property('posts');
        response.should.have.property('users');
        response.should.have.property('releases');
        response.should.have.property('producers');
        response.should.have.property('vn');
        response.should.have.property('chars');
      });
    });

    it('Should fail and return JSON with an error.', function() {
      return vndb.query('dbstat').then(function() {
      }, function (error) {
        error.should.be.a('object');
        error.should.have.property('status', 'error');
        error.should.have.property('msg', "Unknown command \'dbstat\'");
        error.should.have.property('id', 'parse');
      });
    });
  });

  describe('vndb.query (VN)', function() {
    it('Should succeed and return JSON with VN(basic/details) results', function() {
      return vndb.query('get vn basic,details (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('title');
        vn.should.have.property('original');
        vn.should.have.property('length', 'Long');
        vn.should.have.property('aliases');
        vn.aliases.should.be.a('array');
        vn.should.have.property('id', 17);
        vn.languages[0].should.equal('English');
        vn.orig_lang[0].should.equal('Japanese');
      });
    });

    it('Should succeed and return JSON with VN(relations) results', function() {
      return vndb.query('get vn relations (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('relations');
        vn.relations.should.be.a('array');
      });
    });
  });
});
