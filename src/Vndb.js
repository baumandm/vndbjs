const genericPool = require('generic-pool');
const shortid = require('shortid');
const Courier = require('./Courier.js');

class Vndb {

  /**
  * Vndbjs pool manager
  * Manages connections and data transmission
  * @class
  * @param {string} clientName - A name used when connecting to VNDB.org.
  * Each connection appends a shortID.
  */
  constructor(clientName) {
    /**
    * The name prepended to all connections with VNDB.
    * @type {string}
    */
    this.clientName = clientName;

    /**
    * The remote URI to connect to.
    * @type {string}
    */
    this.uri = 'api.vndb.org';

    /**
    * The port number of the connection.
    * @type {number}
    */
    this.port = 19534;

    /**
    * The encoding setting.
    * @type {string}
    */
    this.encoding = 'utf8';

    /**
    * The pool of connections vndbjs will distribute to requests.
    * @type {Object}
    */
    this.connectionPool = genericPool.createPool({
      create: () => {
        return new Promise((resolve, reject) => {
          const client = new Courier();
          client.makeConnection(this.uri, this.port, this.encoding).then(() => {
            client.login(`${this.clientName}-${shortid.generate()}`).then(() => {
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
  * A conveience function to look up vndb stats.
  * Resolves once the server responds.
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

  /**
  * Passes a query string off to the Courier.
  * Resolves once the Courier responds.
  * @param {string} - vndb-compatible query string.
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
}

module.exports = Vndb;
