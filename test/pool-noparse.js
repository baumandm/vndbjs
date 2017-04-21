require('chai').should();
const Vndb = require('../src/Vndb.js')

const vndb = new Vndb({
  clientName: 'VNDBtest',
  pool: true,
  poolMin: 0,
  parse: false
});

describe('Pooled Mode - Parsing Off', function() {
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
        vn.should.have.property('length', 4);
        vn.id.should.equal(17);
      });
    });

    it('Should succeed and return JSON with VN(anime) results', function() {
      return vndb.query('get vn anime (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('anime');
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

    it('Should succeed and return JSON with VN(tags) results', function() {
      return vndb.query('get vn tags (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('tags');
        vn.tags.should.be.a('array');
      });
    });

    it('Should succeed and return JSON with VN(stats) results', function() {
      return vndb.query('get vn stats (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('rating');
        vn.should.have.property('popularity');
        vn.should.have.property('votecount');
        vn.rating.should.be.a('number');
        vn.popularity.should.be.a('number');
        vn.votecount.should.be.a('number');
      });
    });

    it('Should succeed and return JSON with VN(screens) results', function() {
      return vndb.query('get vn screens (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('screens');
        vn.screens.should.be.a('array');
      });
    });

    it('Should fail and return JSON with an error.', function() {
      return vndb.query('get vn basic,anime d = 17)').then(function() {
      }, function (error) {
        error.should.be.a('object');
        error.should.have.property('status', 'error');
        error.should.have.property('msg', 'Invalid arguments to get command');
        error.should.have.property('id', 'parse');
      });
    });
  });

  describe('vndb.query (Release)', function() {
    it('Should succeed and return JSON with Release(basic/details) results', function() {
      return vndb.query('get release basic,details (id = 39520)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const release = response.items[0];
        release.should.be.a('object');
        release.should.have.property('media');
        release.media.should.be.a('array');
        release.should.have.property('title');
        release.title.should.be.a('string');
        release.should.have.property('patch');
        release.patch.should.be.a('boolean');
        release.should.have.property('notes');
        release.should.have.property('website');
        release.website.should.be.a('string');
        release.should.have.property('original');
        release.should.have.property('languages');
        release.languages.should.be.a('array');
        release.should.have.property('gtin');
        release.should.have.property('id', 39520);
        release.id.should.be.a('number');
        release.should.have.property('catalog');
        release.should.have.property('minage');
        release.should.have.property('released');
        release.released.should.be.a('string');
        release.should.have.property('type');
        release.type.should.be.a('string');
        release.type.should.be.equal('complete');
        release.should.have.property('freeware');
        release.freeware.should.be.a('boolean');
        release.freeware.should.equal(true);
        release.should.have.property('doujin');
        release.doujin.should.be.a('boolean');
        release.doujin.should.equal(true);
        release.should.have.property('platforms');
        release.platforms.should.be.a('array');
      });
    });

    it('Should succeed and return JSON with Release(vn/producers) results', function() {
      return vndb.query('get release vn,producers (id = 39520)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const release = response.items[0];
        release.should.be.a('object');
        release.id.should.equal(39520);
        release.should.have.property('producers');
        release.producers.should.be.a('array');
        release.producers[0].should.have.property('name', 'Watercress');
        release.should.have.property('vn');
        release.vn[0].should.have.property('title', 'Palinurus');
      });
    });
  });

  describe('vndb.query (Producer)', function() {
    it('Should succeed and return JSON with Producer(basic/details) results', function() {
      return vndb.query('get producer basic,details (id = 4)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const producer = response.items[0];
        producer.should.be.a('object');
        producer.id.should.equal(4);
        producer.should.have.property('language');
        producer.should.have.property('aliases');
        producer.should.have.property('links');
        producer.should.have.property('description');
        producer.should.have.property('type', 'co');
        producer.should.have.property('name');
        producer.should.have.property('original');
      });
    });

    it('Should succeed and return JSON with Producer(relations) results', function() {
      return vndb.query('get producer relations (id = 4)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const producer = response.items[0];
        producer.should.be.a('object');
        producer.id.should.equal(4);
        producer.should.have.property('relations');
        producer.relations.should.be.a('array');
        producer.relations[0].should.have.property('id', 5633);
      });
    });
  });

  describe('vndb.query (Character)', function() {
    it('Should succeed and return JSON with Character results', function() {
      return vndb.query('get character basic,details (id = 108)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const character = response.items[0];
        character.should.be.a('object');
        character.id.should.equal(108);
        character.should.have.property('name', 'Kagami Sumika');
        character.should.have.property('gender');
        character.should.have.property('birthday');
        character.should.have.property('original');
        character.should.have.property('bloodt');
        character.should.have.property('image');
        character.should.have.property('description');
        character.should.have.property('aliases');
      });
    });

    it('Should succeed and return JSON with Character(meas/traits/vns) results', function() {
      return vndb.query('get character meas,traits,vns (id = 108)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');

        const character = response.items[0];
        character.should.be.a('object');
        character.id.should.equal(108);
        character.should.have.property('waist');
        character.should.have.property('height');
        character.should.have.property('bust');
        character.should.have.property('weight');
        character.should.have.property('traits');
        character.traits.should.be.a('array');
        character.traits[0].should.be.a('array');
        character.should.have.property('hip');
        character.should.have.property('vns');
        character.vns.should.be.a('array');
        character.vns[0].should.be.a('array');
      });
    });
  });

  describe('vndb.query (User)', function() {
    it('Should succeed and return JSON with User results', function() {
      return vndb.query('get user basic (username ~ "Darkarcher117")').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.have.property('num', 1);

        const user = response.items[0];
        user.should.be.a('object');
        user.should.have.property('id', 111679);
        user.should.have.property('username', 'darkarcher117');
      });
    });
  });

  describe('vndb.query (Votelist)', function() {
    it('Should succeed and return JSON with Votelist results', function() {
      return vndb.query('get votelist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');

        const list = response.items[0];
        list.should.be.a('object');
        list.should.have.property('added');
        list.should.have.property('vote');
        list.should.have.property('vn');
      });
    });
  });


  describe('vndb.query (VNlist)', function() {
    it('Should succeed and return JSON with VNlist results', function() {
      return vndb.query('get vnlist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');

        const vnlist = response.items[0];
        vnlist.should.be.a('object');
        vnlist.should.have.property('vn');
        vnlist.should.have.property('notes');
        vnlist.should.have.property('added');
        vnlist.should.have.property('status');
      });
    });
  });

  describe('vndb.query (Wishlist)', function() {
    it('Should succeed and return JSON with Wishlist results', function() {
      return vndb.query('get wishlist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');

        const wishlist = response.items[0];
        wishlist.should.be.a('object');
        wishlist.should.have.property('priority');
        wishlist.should.have.property('added');
        wishlist.should.have.property('vn');
      });
    });
  });
});
