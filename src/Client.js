const shortid = require('shortid');
const Courier = require('./Courier.js');

class Client {

  /**
  * Class representing vndbjs's pool-less interface
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
  }

  /**
  * Passes a query string off to the Courier
  * Resolves once the Courier responds
  * @param {string} message - vndb-compatible query string
  * @returns {Promise<Object>}
  */
  query(message) {
    return new Promise((resolve, reject) => {
      const client = new Courier();
      client.contact(this.uri, this.port, this.encoding).then(() => {
        client.register(`${this.clientName}-${shortid.generate()}`).then(() => {
          client.awaitResponse(message).then((response) => {
            client.destroy();
            resolve(response);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
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
      const client = new Courier();
      client.contact(this.uri, this.port, this.encoding).then(() => {
        client.register(`${this.clientName}-${shortid.generate()}`).then(() => {
          client.awaitResponse('dbstats').then((response) => {
            client.destroy();
            resolve(response);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Client;
