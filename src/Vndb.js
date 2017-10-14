const genericPool = require('generic-pool');
const shortid = require('shortid');
const { RateLimiter } = require('limiter');
const defaults = require('defaults-shallow');
const Connection = require('./Connection.js');
const SecureConnection = require('./SecureConnection.js');

const defaultSettings = {
  encoding: 'utf8',
  rateLimit: 20,
  rateInterval: 60000,
  password: null,
  poolMin: 1,
  poolMax: 10,
  poolTimeout: 30000,
  secure: true,
  username: null
};

/**
* Represents the main vndbjs client
* @class
* @prop {Object} options Vndbjs config settings
* @prop {RateLimiter} limiter A ratelimiter responsible for preventing vndbjs from being throttled
* @prop {Pool} connectionPool A generic pool of SecureConnections or Connections
**/
class Vndbjs {
  /**
  * Create a client
  * @constructor
  * @param {Object} options The Vndbjs configuration object
  * @param {string} options.clientName A unique name identifying this client
  * @param {string} [options.encoding='utf8'] The encoding standard used by all sockets
  * @param {number} [options.rateLimit=20] The number of queries vndbjs will perform every [rateInterval] milliseconds
  * @param {(number|string)} [options.rateInterval=60000] The number of milliseconds during which [rateLimit] queries can be performed.  String values may be 'second', 'minute', 'hour', or 'day'
  * @param {number} [options.poolMin=1] How many connections the pool should maintain
  * @param {number} [options.poolMax=10] The maximum number of connections the pool can open
  * @param {number} [options.poolTimeout=30000] The number of milliseconds a connection can remain idle before being destroyed
  * @param {boolean} [options.secure=true] If true, uses TLS sockets.  Required for user login
  * @param {(string|null)} [options.username=null] The username for a user's VNDB account. Requires a valid password
  * @param {(string|null)} [options.password=null] The password for a user's VNDB account.  Stored as plaintext, so use caution
  */
  constructor(options) {
    defaults(options, defaultSettings);
    this.options = options;
    this.limiter = new RateLimiter(this.options.rateLimit, this.options.rateInterval);
    this.pool = genericPool.createPool({
      create: () => {
        return new Promise((resolve, reject) => {
          const client = this.options.secure ? new SecureConnection() : new Connection();
          client.connect(this.options.encoding).then(() => {
            const socketID = `${this.options.clientName}-${shortid.generate()}`;
            client.login(socketID, options).then(() => {
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
          client.end().then(() => {
            resolve(client);
          });
        });
      }
    }, {
      min: this.options.poolMin,
      max: this.options.poolMax,
      idleTimeoutMillis: this.options.poolTimeout
    });
  }

  /**
  * Drains and terminates the connection pool.  After using, the vndbjs instance will be unusable
  */
  destroy() {
    this.pool.drain().then(() => {
      this.pool.clear();
    });
  }

  /**
  * Acquire a Connection from the pool and send a message
  * @param {string} message A VNDB-compatible get or set command string
  * @see https://vndb.org/d11#5
  * @returns {Promise<Object>} Resolves once the Connection relays the response
  */
  send(message) {
    return new Promise((resolve, reject) => {
      this.limiter.removeTokens(1, () => {
        const connection = this.pool.acquire();
        connection.then((client) => {
          client.write(message).then((response) => {
            this.pool.release(client);
            resolve(response);
          }, (error) => {
            this.pool.release(client);
            reject(error);
          });
        });
      });
    });
  }
}

module.exports = Vndbjs;
