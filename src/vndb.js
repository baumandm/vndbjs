const net = require('net');
const shortid = require('shortid');
const Pool = require('generic-pool').Pool;
const defaults = require('defaults-deep');
const defaultsShallow = require('defaults-shallow');
const version = require('../package.json').version;

const defaultOptions = {
  uri: 'api.vndb.org',
  port: 19534,
  encoding: 'utf8',
  pool: {
    min: 1,
    max: 10,
    idleTimeoutMillis: 30000,
    log: false
  }
};
const defaultInput = {
  type: false,
  flags: ['basic'],
  filters: false,
  options: null
};

// Helper Functions
function parseArgs(args) {
  defaultsShallow(args, defaultInput);
  if (args.type === false || args.filters === false) { return false; }
  if (args.options) {
    return `${args.type} ${args.flags.join(',')} (${args.filters.join(' and ')}) ${JSON.stringify(args.options)}`;
  }
  return `${args.type} ${args.flags.join(',')} (${args.filters.join(' and ')})`;
}

function login(client) {
  return new Promise((resolve, reject) => {
    client.on('error', error => reject(error));
    client.on('data', (data) => {
      let chunk = '';
      chunk += data.toString();
      const response = chunk.substring(0, chunk.indexOf('\x04'));
      if (response === 'ok') {
        client.removeAllListeners('error');
        client.removeAllListeners('data');
        return resolve();
      }
    });
    client.write(`login {"protocol":1,"client":"${this.clientName}-${shortid.generate()}","clientver":"${version}"}\x04`);
  });
}

function connect(client, options) {
  return new Promise((resolve, reject) => {
    client.on('error', error => reject(error));
    client.on('connect', () => {
      client.setEncoding(options.encoding);
      client.removeAllListeners('error');
      client.removeAllListeners('connect');
      return resolve();
    });
    client.connect(options.port, options.uri);
  });
}

// Class
class Api {
  constructor(clientName, options = {}) {
    defaults(options, defaultOptions);
    this.options = options;
    this.clientName = clientName;
    this.pool = new Pool({
      name: 'vndb',
      create: (callback) => {
        const client = new net.Socket();
        connect(client, options).then(() => {
          login(client).then(() => {
            callback(null, client);
          }, () => {
            this.pool.release(client);
          });
        }, () => {
          this.pool.release(client);
        });
      },
      destroy: (client) => { client.destroy(); },
      min: options.pool.min,
      max: options.pool.max,
      idleTimeoutMillis: options.pool.idleTimoutMillis,
      log: options.pool.log
    });
  }

  stats() {
    return this.query('dbstats');
  }

  get(args) {
    const message = parseArgs(args);
    return this.query(`get ${message}`);
  }

  query(message) {
    return new Promise((resolve, reject) => {
      if (message === 'get false') { reject('Missing args'); }
      this.pool.acquire((err, client) => {
        let chunk = '';
        client.on('data', (data) => {
          chunk += data.toString();
          if (data.indexOf('\x04') === -1) {
            return;
          }
          const response = chunk.substring(0, chunk.indexOf('\x04'));
          chunk = chunk.replace(`${response}\x04`, '');
          const command = response.substring(0, response.indexOf(' '));
          const json = response.replace(`${command} `, '');
          const output = JSON.parse(json);
          client.removeAllListeners('data');
          if (command === 'error') {
            this.pool.release(client);
            return reject(response);
          } else if (command === 'results' || command === 'dbstats') {
            this.pool.release(client);
            return resolve(output);
          }
        });
        client.write(`${message}\x04`);
      });
    });
  }
}

module.exports = Api;