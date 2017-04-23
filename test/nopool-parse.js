require('chai').should();
const Vndb = require('../src/Vndb.js')

const vndb = new Vndb({
  clientName: 'vndbjs-test',
  pool: false,
  poolMin: 0,
  poolMax: 2,
  parse: true
});

describe('Unpooled Mode - Parsing On', function() {

  /*****************************************************************************
  *  VNs                                                                       *
  *****************************************************************************/

  describe('vndb.stats', function() {
    it('Should return an object of stats', function() {
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
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');
      });
    });
  });

  describe('vndb.query', function() {
    it('Should return an object of stats', function() {
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
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');
      });
    });

    it('Should return an error.', function() {
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
    it('Should return an object of parsed VNs(basic/details)', function() {
      return vndb.query('get vn basic,details (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

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

    it('Should return an object of parsed VNs(relations)', function() {
      return vndb.query('get vn relations (id = 17)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const vn = response.items[0];
        vn.should.have.property('id', 17);
        vn.should.have.property('relations');
        vn.relations.should.be.a('array');
      });
    });
  });

  /*****************************************************************************
  *  Releases                                                                  *
  *****************************************************************************/

  describe('vndb.query (Release)', function() {
    it('Should return an object of parsed Releases(basic/details)', function() {
      return vndb.query('get release basic,details (id = 39520)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const release = response.items[0];
        release.should.be.a('object');
        release.should.have.property('media');
        release.media.should.be.a('array');
        release.media[0].medium.should.equal('Internet Download');
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
        release.languages[0].should.equal('English');
        release.should.have.property('gtin');
        release.should.have.property('id', 39520);
        release.should.have.property('link', 'https://vndb.org/r39520');
        release.id.should.be.a('number');
        release.should.have.property('catalog');
        release.should.have.property('minage');
        release.should.have.property('released');
        release.released.should.be.a('string');
        release.should.have.property('type');
        release.type.should.be.a('string');
        release.type.should.be.equal('Complete');
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

    it('Should return an object of parsed Releases(vn/producers)', function() {
      return vndb.query('get release vn,producers (id = 39520)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const release = response.items[0];
        release.should.be.a('object');
        release.id.should.equal(39520);
        release.should.have.property('link', 'https://vndb.org/r39520');
        release.should.have.property('producers');
        release.producers.should.be.a('array');
        release.producers[0].should.be.a('object');
        release.producers[0].should.have.property('name', 'Watercress');
        release.producers[0].should.have.property('type', 'Amateur Group');
        release.should.have.property('vn');
        release.vn[0].should.have.property('title', 'Palinurus');
      });
    });
  });

  /*****************************************************************************
  *  Producers                                                                 *
  *****************************************************************************/

  describe('vndb.query (Producer)', function() {
    it('Should return an object of parsed Producers(basic/details)', function() {
      return vndb.query('get producer basic,details (id = 4)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const producer = response.items[0];
        producer.should.be.a('object');
        producer.should.have.property('id', 4);
        producer.should.have.property('link', 'https://vndb.org/p4');
        producer.should.have.property('language', 'Japanese');
        producer.should.have.property('aliases');
        producer.aliases.should.be.a('array');
        producer.should.have.property('links');
        producer.links.should.be.a('object');
        producer.links.should.have.property('homepage');
        producer.links.should.have.property('wikipedia');
        producer.should.have.property('description');
        producer.should.have.property('type', 'Company');
        producer.should.have.property('name');
        producer.should.have.property('original');
      });
    });

    it('Should return an object of parsed Producers(relations)', function() {
      return vndb.query('get producer relations (id = 4)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const producer = response.items[0];
        producer.should.be.a('object');
        producer.should.have.property('id', 4);
        producer.should.have.property('link', 'https://vndb.org/p4');
        producer.should.have.property('relations');
        producer.relations.should.be.a('array');
        producer.relations[0].should.have.property('id', 5633);
        producer.relations[0].should.have.property('relation', 'Parent Brand');
      });
    });
  });

  /*****************************************************************************
  *  Characters                                                                *
  *****************************************************************************/

  describe('vndb.query (Character)', function() {
    it('Should return an object of parsed Characters', function() {
      return vndb.query('get character basic,details (id = 108)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const character = response.items[0];
        character.should.be.a('object');
        character.should.have.property('id', 108);
        character.should.have.property('link', 'https://vndb.org/c108');
        character.should.have.property('name', 'Kagami Sumika');
        character.should.have.property('gender');
        character.should.have.property('birthday');
        character.birthday.should.be.a('object');
        character.birthday.should.have.property('day', 7);
        character.birthday.should.have.property('month', 7);
        character.should.have.property('original');
        character.should.have.property('bloodtype', 'O');
        character.should.have.property('image');
        character.should.have.property('description');
        character.should.have.property('aliases');
      });
    });
  });

  /*****************************************************************************
  *  Users                                                                     *
  *****************************************************************************/

  describe('vndb.query (User)', function() {
    it('Should return an object of parsed Users', function() {
      return vndb.query('get user basic (username ~ "Darkarcher117")').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', false);
        response.should.have.property('items');
        response.should.have.property('num', 1);
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const user = response.items[0];
        user.should.be.a('object');
        user.should.have.property('id', 111679);
        user.should.have.property('link', 'https://vndb.org/u111679');
        user.should.have.property('username', 'darkarcher117');
      });
    });
  });

  /*****************************************************************************
  *  Votelists                                                                 *
  *****************************************************************************/

  describe('vndb.query (Votelist)', function() {
    it('Should return an object of parsed Votelists', function() {
      return vndb.query('get votelist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.should.have.property('link', 'https://vndb.org/u111679/votes');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const list = response.items[0];
        list.should.be.a('object');
        list.should.have.property('added');
        list.should.have.property('vote');
        list.vote.should.be.at.least(0);
        list.vote.should.be.at.most(10);
        list.should.have.property('vn');
      });
    });
  });

  /*****************************************************************************
  *  VNlists                                                                   *
  *****************************************************************************/

  describe('vndb.query (VNlist)', function() {
    it('Should return an object of parsed VNlists', function() {
      return vndb.query('get vnlist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.should.have.property('link', 'https://vndb.org/u111679/list');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const vnlist = response.items[0];
        vnlist.should.be.a('object');
        vnlist.should.have.property('vn');
        vnlist.should.have.property('notes');
        vnlist.should.have.property('added');
        vnlist.should.have.property('status');
        vnlist.status.should.equal('Finished');
      });
    });
  });

  /*****************************************************************************
  *  Wishlists                                                                 *
  *****************************************************************************/

  describe('vndb.query (Wishlist)', function() {
    it('Should return an object of parsed Wishlists', function() {
      return vndb.query('get wishlist basic (uid = 111679)').then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');
        response.should.have.property('more', true);
        response.should.have.property('items');
        response.should.have.property('link', 'https://vndb.org/u111679/wish');
        response.should.not.have.property('searchType');
        response.should.not.have.property('searchID');

        const wishlist = response.items[0];
        wishlist.should.be.a('object');
        wishlist.should.have.property('priority');
        wishlist.priority.should.equal('Medium')
        wishlist.should.have.property('added');
        wishlist.should.have.property('vn');
      });
    });
  });
});
