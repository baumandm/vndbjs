/* eslint class-methods-use-this: "off" */
const version = require('../package.json').version;
const Vn = require('./data/Vn.js');
const Release = require('./data/Release.js');
const Producer = require('./data/Producer.js');
const Character = require('./data/Character.js');
const Staff = require('./data/Staff.js');
const User = require('./data/User.js');
const Vnlist = require('./data/Vnlist.js');
const Votelist = require('./data/Votelist.js');
const Wishlist = require('./data/Wishlist.js');

/**
* Represents a generic socket
* @class
* @prop {string} eol The end-of-line character `\x04`
* @prop {string} uri The host uri of VNDB
**/
class GenericConnection {
  /**
  * Generic template of a connection
  * @constructor
  */
  constructor() {
    this.eol = '\x04';
    this.uri = 'api.vndb.org';
  }

  /**
  * Registers client with VNDB
  * @param {string} socketID A UUID for this particular connection, used to register with VNDB
  * @param {Object} options Vndbjs options
  * @returns {Promise<String>} Resolves once the server authorizes connection
  */
  login(socketID, options) {
    return new Promise((resolve, reject) => {
      this.socket.once('error', err => reject(err));
      let chunk = '';
      this.socket.on('data', (data) => {
        chunk += data.toString();
        const response = chunk.substring(0, chunk.indexOf(this.eol));
        if (response === 'ok') {
          this.socket.removeAllListeners('error');
          this.socket.removeAllListeners('data');
          resolve('ok');
        }
      });
      if (options.username === null && options.password === null) {
        this.socket.write(`login {"protocol":1,"client": "${socketID}",
        "clientver": "${version}"}${this.eol}`);
      } else {
        this.socket.write(`login {"protocol":1,"client": "${socketID}",
        "clientver": "${version}","username":"${options.username}",
        "password":"${options.password}"}${this.eol}`);
      }
    });
  }

  /**
  * Format a response into an Object
  * @param {string} response The raw response from VNDB
  * @param {string} message A VNDB-compatible `get` or `set` command string
  * @returns {Object}
  */
  splitResponse(response, message) {
    const status = response.match(/(\S+)\b/)[1];
    if (status === 'ok') {
      return {
        status,
        metadata: { raw: message }
      };
    }
    const body = JSON.parse(response.match(/{.+}/)[0]);
    if (status === 'error') {
      body.metadata = { raw: message };
      body.status = status;
      return body;
    } else if (status === 'dbstats') {
      body.metadata = { raw: message };
      body.status = status;
      return body;
    }
    const type = message.substring(4, message.indexOf(' ', 4));
    if (type === 'votelist' || type === 'vnlist' || type === 'wishlist') {
      const id = message.match(/\(uid.+?(\d+)\)/)[1];
      body.status = status;
      body.metadata = {
        raw: message,
        userID: id,
        type
      };
      if (type === 'votelist') {
        body.metadata.link = `https://vndb.org/u${id}/votes`;
      } else if (type === 'vnlist') {
        body.metadata.link = `https://vndb.org/u${id}/list`;
      } else if (type === 'wishlist') {
        body.metadata.link = `https://vndb.org/u${id}/wish`;
      }
      return body;
    }
    body.status = status;
    body.metadata = {
      raw: message,
      type
    };
    return body;
  }

  /**
  * Sends a command string to VNDB
  * @param {string} message A VNDB-compatible `get` or `set` command string
  * @returns {Promise<Object>} Resolves when a response is received
  */
  write(message) {
    return new Promise((resolve, reject) => {
      let chunk = '';
      this.socket.on('data', (data) => {
        chunk += data.toString();
        if (data.indexOf(this.eol) === -1) return;
        this.socket.removeAllListeners('data');
        const response = this.splitResponse(chunk, message);
        if (response.status === 'error') {
          reject(response);
        } else if (response.status === 'ok' || response.status === 'dbstats') {
          resolve(response);
        } else {
          switch (response.metadata.type) {
            case 'vn':
              response.items = response.items.map((item) => {
                return new Vn(item);
              });
              break;
            case 'release':
              response.items = response.items.map((item) => {
                return new Release(item);
              });
              break;
            case 'producer':
              response.items = response.items.map((item) => {
                return new Producer(item);
              });
              break;
            case 'character':
              response.items = response.items.map((item) => {
                return new Character(item);
              });
              break;
            case 'staff':
              response.items = response.items.map((item) => {
                return new Staff(item);
              });
              break;
            case 'user':
              response.items = response.items.map((item) => {
                return new User(item);
              });
              break;
            case 'vnlist':
              response.items = response.items.map((item) => {
                return new Vnlist(item);
              });
              break;
            case 'votelist':
              response.items = response.items.map((item) => {
                return new Votelist(item);
              });
              break;
            case 'wishlist':
              response.items = response.items.map((item) => {
                return new Wishlist(item);
              });
              break;
            default:
              break;
          }
          resolve(response);
        }
      });
      this.socket.write(`${message}${this.eol}`);
    });
  }
}

module.exports = GenericConnection;
