require('chai').should();
const Vndbjs = require('../src/Vndb.js')

const vndbjs = new Vndbjs({
  clientName: 'vndbjs-test',
  secure: false
});

describe('Insecure Tests', function() {

  describe('Get single VN', function() {
    it('Should return basic VN info', function() {
      return vndbjs
      .send('get vn basic (id = 11)')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'results');

      });
    });
  });

  describe('Error handling', function() {
    it('Should return error', function() {
      return vndbjs
      .send('get vn basic (id = ")')
      .then(function() {

      }, function(err) {
        err.should.be.a('object');
        err.should.have.property('status', 'error');
      });
    });
  });

  describe('DBstats', function() {
    it('Should return dbstats', function() {
      return vndbjs
      .send('dbstats')
      .then(function(response) {
        response.should.be.a('object');
        response.should.have.property('status', 'dbstats');
        vndbjs.destroy();
      });
    });
  });
});
