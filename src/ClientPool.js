const genericPool = require('generic-pool');
const shortid = require('shortid');
const Courier = require('./Courier.js');

class ClientPool {

  /**
  * Class representing vndbjs's connection pool interface
  * Manages connections and data transmission
  * @class
  * @param {Object} options - The ClientPool configuration object
  * @param {string} options.clientName - A name representing the client application
  * @param {string} [options.uri='api.vndb.org'] - [Debug only] The uri you want to connect to
  * @param {number} [options.port=19534] - [Debug only] The port number of the connection.  The TSL port is currently unsupported
  * @param {string} [options.encoding='utf8'] - [Debug only] The encoding standard to use
  * @param {boolean} [options.parse=true] - Set true to have vndbjs adjust results to improve usability
  */
  constructor(options) {
    /**
    * The name prepended to all connections with VNDB
    * @type {string}
    */
    this.clientName = options.clientName;

    /**
    * The remote URI to connect to
    * @type {string}
    */
    this.uri = options.uri;

    /**
    * The port number of the connection
    * @type {number}
    */
    this.port = options.port;

    /**
    * The encoding setting
    * @type {string}
    */
    this.encoding = options.encoding;

    /**
    * Whether or not vndbjs should convert vndb responses to a more usable format
    * @type {boolean}
    */
    this.parse = options.parse;

    /**
    * The pool of connections vndbjs will distribute to requests
    * @type {Object}
    */
    this.connectionPool = genericPool.createPool({
      create: () => {
        return new Promise((resolve, reject) => {
          const client = new Courier();
          client.contact(this.uri, this.port, this.encoding).then(() => {
            client.register(`${this.clientName}-${shortid.generate()}`).then(() => {
              resolve(client);
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        });
      },
      destroy: (client) => {
        return new Promise((resolve) => {
          client.on('end', () => {
            resolve(client);
          });
          client.end();
        });
      }
    }, {
      min: 1,
      max: 10
    });
  }

  /**
  * Passes a query string off to the Courier
  * Resolves once the Courier responds
  * @param {string} - vndb-compatible query string
  * @returns {Promise<Object>}
  */
  query(message) {
    return new Promise((resolve, reject) => {
      const connection = this.connectionPool.acquire();
      connection.then((client) => {
        client.awaitResponse(message).then((response) => {
          this.connectionPool.release(client);
          resolve(response);
        }, (error) => {
          this.connectionPool.release(client);
          reject(error);
        });
      });
    });
  }

  /**
  * A conveience function to look up vndb stats
  * Resolves once the server responds
  * @function
  * @returns {Promise<Object>}
  */
  stats() {
    return new Promise((resolve, reject) => {
      this.query('dbstats').then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }
}

module.exports = ClientPool;
