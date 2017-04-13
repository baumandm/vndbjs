const Vndb = require('../src/Vndb.js');
const vndb = new Vndb('vndbtesting');
const should = require('chai').should();

describe('vndb.stats', function() {
  it('Should succeed and return JSON with results', function() {
    return vndb.stats().then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'dbstats');
      response.should.have.property('body');
      response.should.have.deep.property('body.tags');
      response.head.should.be.a('string');
    });
  });
});

describe('vndb.query', function() {
  it('Should succeed and return JSON with results', function() {
    return vndb.query('dbstats').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'dbstats');
      response.should.have.property('body');
      response.should.have.deep.property('body.tags');
      response.head.should.be.a('string');
    });
  });

  it('Should fail and return JSON with an error.', function() {
    return vndb.query('dbstat').then(function() {

    }, function (error) {
      error.should.be.a('object');
      error.should.have.property('head', 'error');
      error.body.should.have.property('msg', "Unknown command 'dbstat'");
      error.body.should.have.property('id', 'parse');
    });
  });
});

describe('vndb.query (VN)', function() {
  it('Should succeed and return JSON with VN results', function() {
    return vndb.query('get vn basic,anime (id = 17)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', false);
      response.body.more.should.be.a('boolean');
      response.should.have.deep.property('body.num', 1);
      response.body.num.should.be.a('number');
      response.should.have.deep.property('body.items');
      response.head.should.be.a('string');

      const items = response.body.items;

      items.should.be.a('array');
      items[0].id.should.equal(17);
      items[0].should.be.a('object');
    });
  });

  it('Should fail and return JSON with an error.', function() {
    return vndb.query('get vn basic,anime d = 17)').then(function() {

    }, function (error) {
      error.should.be.a('object');
      error.should.have.property('head', 'error');
      error.body.should.have.property('msg', 'Invalid arguments to get command');
      error.body.should.have.property('id', 'parse');
    });
  });
});

describe('vndb.query (Release)', function() {
  it('Should succeed and return JSON with Release results', function() {
    return vndb.query('get release basic,details (id = 39520)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', false);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].id.should.equal(39520);

    });
  });
});


describe('vndb.query (Producer)', function() {
  it('Should succeed and return JSON with Producer results', function() {
    return vndb.query('get producer basic,details (id = 4)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', false);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].id.should.equal(4);
      items[0].type.should.equal('co');
    });
  });
});


describe('vndb.query (Character)', function() {
  it('Should succeed and return JSON with Character results', function() {
    return vndb.query('get character basic,details (id = 108)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', false);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].id.should.equal(108);
      items[0].name.should.equal('Kagami Sumika');
    });
  });
});


describe('vndb.query (User)', function() {
  it('Should succeed and return JSON with User results', function() {
    return vndb.query('get user basic (username ~ "Darkarcher117")').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', false);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].id.should.equal(111679);
      items[0].username.should.equal('darkarcher117');
    });
  });
});


describe('vndb.query (Votelist)', function() {
  it('Should succeed and return JSON with Votelist results', function() {
    return vndb.query('get votelist basic (uid = 111679)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', true);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].should.have.property('added');
      items[0].should.have.property('vn');
      items[0].should.have.property('vote');
    });
  });
});


describe('vndb.query (VNlist)', function() {
  it('Should succeed and return JSON with VNlist results', function() {
    return vndb.query('get vnlist basic (uid = 111679)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', true);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].should.have.property('status');
      items[0].should.have.property('vn');
      items[0].should.have.property('notes');
      items[0].should.have.property('added');
    });
  });
});


describe('vndb.query (Wishlist)', function() {
  it('Should succeed and return JSON with Wishlist results', function() {
    return vndb.query('get wishlist basic (uid = 111679)').then(function(response) {
      response.should.be.a('object');
      response.should.have.property('head', 'results');
      response.should.have.property('body');
      response.should.have.deep.property('body.more', true);

      const items = response.body.items;

      items.should.be.a('array');
      items[0].should.be.a('object');
      items[0].should.have.property('vn');
      items[0].should.have.property('priority');
      items[0].should.have.property('added');
    });
  });
});
