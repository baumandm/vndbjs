const genericPool = require('generic-pool');
const shortid = require('shortid');
const defaults = require('defaults-shallow');
const Courier = require('./Courier.js');

const defaultSettings = {
  pool: true,
  poolMin: 1,
  poolMax: 10,
  poolTimeout: 30000,
  uri: 'api.vndb.org',
  port: 19534,
  encoding: 'utf8',
  parse: true
};

class Vndb {

  /**
  * Class representing vndbjs's connection interface
  * Manages connections and data transmission
  * @class
  * @param {Object} options - The Client configuration object
  * @param {string} options.clientName - A name representing the client application
  * @param {boolean} [options.pool=true] - true: Vndbjs runs in Pooled Mode.  Connections are maintained long-term for re-use.  Lowers latency
  * false: Vndbjs must open a new connection for every query.  Increases latency, but may also decrease memory usage when not in use
  * @param {number} [options.poolMin=1] - The minimum number of connections the pool will maintain at all times
  * @param {number} [options.poolMax=10] - [Debug only] The maximum number of connections the pool can hold.  VNDB.org limits active connections from the same IP to 10, so changing this is unadvised
  * @param {number} [options.poolTimeout=30000] - The time in milliseconds that an idle connection will stay open before being destroyed
  * @param {string} [options.uri='api.vndb.org'] - [Debug only] The uri you want to connect to
  * @param {number} [options.port=19534] - [Debug only] The port number of the connection.  The TSL port is currently unsupported
  * @param {string} [options.encoding='utf8'] - [Debug only] The encoding standard to use
  * @param {boolean} [options.parse=true] - Set true to have vndbjs adjust results to improve usability.  Examples may be found in the tutorials
  */
  constructor(options) {
    defaults(options, defaultSettings);
    /**
    * The name prepended to all connections with VNDB
    * @type {string}
    */
    this.clientName = options.clientName;

    /**
    * The boolean switch between pooled and unpooled modes
    * @type {boolean}
    */
    this.pool = options.pool;

    /**
    * The minimum number of connections to pool
    * @type {number}
    */
    this.poolMin = options.poolMin;

    /**
    * The maximum number of connections to pool
    * @type {number}
    */
    this.poolMax = options.poolMax;

    /**
    * The time in milliseconds that an idle connection will stay open before being destroyed
    * @type {number}
    */
    this.poolTimeout = options.poolTimeout;

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

    if (this.pool === true) {
      /**
      * The pool of connections vndbjs will distribute to requests
      * Will not be present if pool is set to false
      * @type {Object}
      */
      this.connectionPool = genericPool.createPool({
        create: () => {
          return new Promise((resolve, reject) => {
            const client = new Courier(this.parse);
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
        min: this.poolMin,
        max: this.poolMax,
        idleTimeoutMillis: this.poolTimeout
      });
    }
  }

  /**
  * Passes a query string off to the Courier
  * Resolves once the Courier responds
  * @param {string} - vndb-compatible query string
  * @returns {Promise<Object>}
  */
  query(message) {
    return new Promise((resolve, reject) => {
      if (this.pool === true) {
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
      } else {
        const client = new Courier(this.parse);
        client.contact(this.uri, this.port, this.encoding).then(() => {
          client.register(`${this.clientName}-${shortid.generate()}`).then(() => {
            client.awaitResponse(message).then((response) => {
              client.destroy();
              resolve(response);
            }, (err) => {
              client.destroy();
              reject(err);
            });
          }, (err) => {
            client.destroy();
            reject(err);
          });
        }, (err) => {
          client.destroy();
          reject(err);
        });
      }
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
      if (this.pool === true) {
        this.query('dbstats').then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
      } else {
        const client = new Courier(this.parse);
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
      }
    });
  }
}

module.exports = Vndb;
