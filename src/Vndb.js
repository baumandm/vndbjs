const Client = require('./Client.js');
const ClientPool = require('./ClientPool.js');
const defaults = require('defaults-shallow');

const defaultSettings = {
  pool: true,
  uri: 'api.vndb.org',
  port: 19534,
  encoding: 'utf8',
  parse: true
};

module.exports = {

  /**
  * The Vndbjs constructor
  * @name init
  * @module
  * @param {Object} options - Config object
  * @param {string} options.clientName - A name representing the client application.
  * @param {boolean} [options.pool=true] - true: Vndbjs runs in Pooled Mode.  Connections are maintained long-term for re-use.  Lowers latency
  * false: Vndbjs must open a new connection for every query.  Increases latency, but may also decrease memory usage when not in use
  * @param {string} [options.uri='api.vndb.org'] - [Debug only] The uri you want to connect to
  * @param {number} [options.port=19534] - [Debug only] The port number of the connection.  The TSL port is currently unsupported
  * @param {string} [options.encoding='utf8'] - [Debug only] The encoding standard to use
  * @param {boolean} [options.parse=true] - Set true to have vndbjs adjust results to improve usability
  * @returns new ClientPool(options) OR new Client(options)
  **/
  init(options = {}) {
    const pool = options.pool;
    defaults(options, defaultSettings);
    options.pool = undefined;
    options = JSON.parse(JSON.stringify(options));
    if (pool === true) {
      return new ClientPool(options);
    }
    return new Client(options);
  }
};
