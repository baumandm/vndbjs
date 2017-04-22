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

/**
* Represents the main vndbjs client
* @class
* @prop {Object} options Vndbjs config settings
* @prop {Object} connectionPool The connection pool
**/
class Vndb {

  /**
  * Create a client
  * @constructor
  * @param {Object} options The Client configuration object
  * @param {string} options.clientName A unique name signifying this client
  * @param {boolean} [options.pool=true] Whether to run in Pooled Mode
  * @param {number} [options.poolMin=1] How many connections the pool should maintain
  * @param {number} [options.poolMax=10] The maximum number of connections the pool can open
  * @param {number} [options.poolTimeout=30000] The number of milliseconds a connection can remain idle before being destroyed
  * @param {string} [options.uri='api.vndb.org'] The uri of VNDB's database server
  * @param {number} [options.port=19534] The port number of VNDB's database server
  * @param {string} [options.encoding='utf8'] The encoding standard used by all sockets
  * @param {boolean} [options.parse=true] Whether the sockets should clean VNDB's responses before returning
  */
  constructor(options) {
    defaults(options, defaultSettings);
    this.options = options;
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
  }

  /**
  * Get general stats from VNDB
  * @returns {Promise<Object>} Resolves once the server responds
  */
  stats() {
    return new Promise((resolve, reject) => {
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
  }
}

module.exports = Vndb;
