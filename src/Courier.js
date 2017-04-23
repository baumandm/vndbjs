/* eslint class-methods-use-this: "off" */
const net = require('net');
const clean = require('./clean.js');
const version = require('../package.json').version;

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

/**
* Represents a socket connection
* @class
* @extends net.Socket
* @see {@link https://nodejs.org/api/net.html#net_class_net_socket|net.Socket}
* @prop {string} eol The end of line character
* @prop {boolean} parse Whether to clean data from VNDB
**/
class Courier extends net.Socket {
  /**
  * Create a socket
  * @constructor
  * @param {boolean} clean - If true, will clean results before returning
  */
  constructor(parse) {
    super();
    this.eol = '\x04';
    this.parse = parse;
  }

  /**
  * Sends a query to VNDB
  * @param {string} - A VNDB-compatible query string
  * @returns {Promise<Object>} Resolves when a response is received
  */
  awaitResponse(message) {
    return new Promise((resolve, reject) => {
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        if (data.indexOf(this.eol) === -1) return;
        this.removeAllListeners('data');
        const response = this.splitResponse(chunk, message);
        if (response.status === 'error') {
          switch (response.id) {
            case 'throttled':
              wait(response.fullwait * 1000).then(() => {
                this.awaitResponse(message).then((delayedResponse) => {
                  resolve(delayedResponse);
                }, (error) => {
                  reject(error);
                });
              });
              break;
            default:
              reject(response);
          }
        } else if (this.parse) {
          if (response.status === 'dbstats') {
            response.searchType = undefined;
            response.searchID = undefined;
            resolve(JSON.parse(JSON.stringify(response)));
          }
          clean.parse(response).then((cleaned) => {
            resolve(cleaned);
          }, (error) => {
            reject(error);
          });
        } else {
          response.searchType = undefined;
          response.searchID = undefined;
          resolve(JSON.parse(JSON.stringify(response)));
        }
      });
      this.write(`${message}${this.eol}`);
    });
  }

  /**
  * Connects to the server
  * @param {string} uri The remote URI to connect to
  * @param {number} port The port number of the connection
  * @param {string} encoding The encoding setting
  * @returns {Promise} Resolves once the server confirms the connection
  */
  contact(uri, port, encoding) {
    return new Promise((resolve, reject) => {
      this.once('error', () => reject('vndbjs: connection failed'));
      this.on('connect', () => {
        this.setEncoding(encoding);
        this.removeAllListeners('error');
        this.removeAllListeners('connect');
        resolve();
      });
      this.connect(port, uri);
    });
  }

  /**
  * Registers client with VNDB
  * @param {string} clientName A UUID for this particular connection, used to log in
  * @returns {Promise} Resolves once the server authorizes connection
  */
  register(clientName) {
    return new Promise((resolve, reject) => {
      this.once('error', error => reject(error));
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        const response = chunk.substring(0, chunk.indexOf(this.eol));
        if (response === 'ok') {
          this.removeAllListeners('error');
          this.removeAllListeners('data');
          resolve();
        }
      });
      this.write(`login {"protocol":1,"client":"${clientName}"
,"clientver":"${version}"}${this.eol}`);
    });
  }

  /**
  * Format a response into an Object
  * @param {string} response The raw response from VNDB
  * @param {string} message The query string
  * @returns {Object}
  */
  splitResponse(response, message) {
    const status = response.match(/(\S+) {/)[1];
    const body = JSON.parse(response.match(/{.+}/)[0]);
    if (status === 'error') {
      body.status = status;
      return body;
    }
    if (status === 'dbstats') {
      body.status = status;
      return body;
    }
    const searchType = message.substring(4, message.indexOf(' ', 4));
    if (searchType === 'votelist' || searchType === 'vnlist' || searchType === 'wishlist') {
      const id = message.match(/\(uid.+?(\d+)\)/)[1];
      body.status = status;
      body.searchID = id;
      body.searchType = searchType;
      return body;
    }
    body.status = status;
    body.searchType = searchType;
    return body;
  }
}

module.exports = Courier;
