const genericPool = require('generic-pool');
const shortid = require('shortid');
const RateLimiter = require('limiter').RateLimiter;
const defaults = require('defaults-shallow');
const Courier = require('./Courier.js');

const defaultSettings = {
  uri: 'api.vndb.org',
  port: 19534,
  encoding: 'utf8',
  queryLimit: 20,
  queryInterval: 60000,
  parse: true,
  pool: true,
  poolMin: 1,
  poolMax: 10,
  poolTimeout: 30000
};

/**
* Represents the main vndbjs client
* @class
* @prop {Object} options Vndbjs config settings
* @prop {RateLimiter} limiter A ratelimiter responsible for preventing vndbjs from overloading VNDB
* @prop {Pool} connectionPool A generic pool of Couriers
**/
class Vndb {
  /**
  * Create a client
  * @constructor
  * @param {Object} options The Client configuration object
  * @param {string} options.clientName A unique name identifying this client
  * @param {string} [options.uri='api.vndb.org'] The uri of VNDB's database server
  * @param {number} [options.port=19534] The port number of VNDB's database server
  * @param {string} [options.encoding='utf8'] The encoding standard used by all sockets
  * @param {number} [options.queryLimit=20] The number of queries vndbjs will perform every [queryLimit] milliseconds
  * @param {number|string} [options.queryInterval=60000] The number of milliseconds during which [queryLimit] queries can be performed.  String values may be 'second', 'minute', 'hour', or 'day'
  * @param {boolean} [options.parse=true] Whether the sockets should clean VNDB's responses before returning
  * @param {boolean} [options.pool=true] Whether to run in Pooled mode
  * @param {number} [options.poolMin=1] How many connections the pool should maintain
  * @param {number} [options.poolMax=10] The maximum number of connections the pool can open
  * @param {number} [options.poolTimeout=30000] The number of milliseconds a connection can remain idle before being destroyed
  */
  constructor(options) {
    defaults(options, defaultSettings);
    this.options = options;
    this.limiter = new RateLimiter(options.queryLimit, options.queryInterval);
    if (this.options.pool === true) {
      this.connectionPool = genericPool.createPool({
        create: () => {
          return new Promise((resolve, reject) => {
            const client = new Courier(this.options.parse);
            client.contact(this.options.uri, this.options.port, this.options.encoding).then(() => {
              client.register(`${this.options.clientName}-${shortid.generate()}`).then(() => {
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
        min: this.options.poolMin,
        max: this.options.poolMax,
        idleTimeoutMillis: this.options.poolTimeout
      });
    }
  }

  /**
  * Create a Courier to send a message
  * @param {string} message VNDB-compatible query string
  * @returns {Promise<Object>} Resolves once the Courier responds
  */
  query(message) {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, () => {
        if (this.options.pool === true) {
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
          const client = new Courier(this.options.parse);
          client.contact(this.options.uri, this.options.port, this.options.encoding).then(() => {
            client.register(`${this.options.clientName}-${shortid.generate()}`).then(() => {
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
    });
  }

  /**
  * Request general metrics from VNDB
  * @returns {Promise<Object>} Resolves once the server responds
  */
  stats() {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, () => {
        if (this.options.pool === true) {
          this.query('dbstats').then((response) => {
            resolve(response);
          }, (error) => {
            reject(error);
          });
        } else {
          const client = new Courier(this.options.parse);
          client.contact(this.options.uri, this.options.port, this.options.encoding).then(() => {
            client.register(`${this.options.clientName}-${shortid.generate()}`).then(() => {
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
    });
  }
}

module.exports = Vndb;
