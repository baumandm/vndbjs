const net = require('net');
const version = require('./package.json').version;
const shortid = require('shortid');
const Pool = require('generic-pool').Pool;

function parseArgs(args) {
  let type = args.hasOwnProperty('type') ? args.type : false;
  let flags = args.hasOwnProperty('flags') ? args.flags : ['basic', 'details', 'stats'];
  let filter = args.hasOwnProperty('filter') ? args.filter : false;
  if (type === false || filter === false) { return false}
  return `${args.type} ${flags.join(',')} (${filter.type} ${filter.oper} ${filter.value})`
}

function login(client) {
  return new Promise((resolve, reject) => {
    client.on('error', (error) => {
      console.log(`ERROR: ${error}`);
    });
    client.on('data', (data) => {
      let chunk = '';
      chunk += data.toString();
      const response = chunk.substring(0, chunk.indexOf('\x04'));
      if (response === 'ok') {
        // console.log('Logged in to VNDB')
      }
      client.removeAllListeners('error');
      client.removeAllListeners('data');
      return resolve();
    });
    client.write(`login {"protocol":1,"client":"${this.clientName}-${shortid.generate()}","clientver":"${version}"}\x04`);
  });
}

function connect(client) {
  return new Promise((resolve, reject) => {
    client.on('error', (error) => {
      console.log(`ERROR: ${error}`);
      return reject();
    });
    client.on('connect', () => {
      // console.log('connection successful');
      client.setEncoding('utf8');
      client.removeAllListeners('error');
      client.removeAllListeners('connect');
      return resolve();
    });
    client.connect(19534, 'api.vndb.org');
  });
}

class Api {
  constructor(clientName) {
    this.clientName = clientName;
    this.pool = new Pool({
      name: 'vndb',
      create: (callback) => {
        const client = new net.Socket();
        connect(client).then(() => {
          login(client).then(() => {
            callback(null, client);
          }, (err) => {
            console.log(`Login failed: ${err}`);
          });
        }, (err) => {
          console.log(`Connection Failed: ${err}`);
        });
      },
      destroy: (client) => { client.destroy(); },
      max: 10,
      min: 2,
      idleTimeoutMillis: 30000,
      log: false
    });
  }

  stats() {
    return this.query('dbstats');
  }

  searchVnList(title) {
    return this.query(`get vn basic (search ~ "${title}")`);
  }

  getVnByTitleFull(exactTitle) {
    return this.query(`get vn basic,details,stats,anime,relations,tags,screens (title = "${exactTitle}")`);
  }

  getVnByTitle(exactTitle) {
    return this.query(`get vn basic,details,stats (title = "${exactTitle}")`);
  }

  getVnByIdFull(id) {
    return this.query(`get vn basic,details,stats,anime,relations,tags,screens (id = ${id})`);
  }

  getVnById(id) {
    return this.query(`get vn basic,details,stats (id = ${id})`);
  }

  get(args) {
    var message = parseArgs(args);
    return this.query(`get ${message}`);
  }

  query(message) {
    return new Promise((resolve, reject) => {
      this.pool.acquire((err, client) => {
        if (err) {
          console.log(`ERROR: ${err}`);
        } else {
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
        }
      });
    });
  }
}

module.exports = Api;
