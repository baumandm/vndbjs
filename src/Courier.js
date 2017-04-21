const net = require('net');
const clean = require('./clean.js');
const version = require('../package.json').version;

/**
* Splits a response string into a header and body
* @param {string} - The response to be parsed
* @returns {Object}
*/
function splitResponse(response, message) {
  const space = response.indexOf(' ');
  const status = response.substring(0, space);
  const body = JSON.parse(response.substring(space + 1, response.indexOf('\x04')));
  if (status === 'error') {
    return JSON.parse(JSON.stringify({
      status,
      msg: body.msg,
      id: body.id
    }));
  }
  if (status === 'dbstats') {
    body.status = status;
    return body;
  }
  return {
    status: response.substring(0, space),
    searchType: message.substring(4, message.indexOf(' ', 4)),
    more: body.more,
    items: body.items,
    num: body.num
  };
}

class Courier extends net.Socket {

  /**
  * Manages an individual connections functionality
  * @class
  * @param {boolean} clean - If true, will clean results before returning
  * @extends net.Socket
  * @see {@link https://nodejs.org/api/net.html#net_class_net_socket|net.Socket}
  */
  constructor(parse) {
    super();

    /**
    * The end-of-line character
    * @type {string}
    */
    this.eol = '\x04';

    /**
    * If true, will clean results before returning
    * @type {boolean}
    */
    this.parse = parse;
  }

  /**
  * Sends a message and collects the response
  * Resolves once the message has been recieved and parsed
  * @param {string} - The message to be sent to the server
  * @returns {Promise<Object>}
  */
  awaitResponse(message) {
    return new Promise((resolve, reject) => {
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        if (data.indexOf(this.eol) === -1) return;
        this.removeAllListeners('data');
        const response = splitResponse(chunk, message);
        if (response.status === 'error') {
          reject(response);
        } else if (this.parse) {
          switch (response.searchType) {
            case 'vn':
              clean.vn(response).then((cleaned) => {
                resolve(cleaned);
              }, (error) => {
                reject(error);
              });
              break;
            default:
              resolve(response);
          }
        } else {
          response.searchType = undefined;
          resolve(JSON.parse(JSON.stringify(response)));
        }
      });
      this.send(message);
    });
  }

  /**
  * Establishes a connection with the vndb server
  * Resolves once the server is connected
  * @param {string} - The remote URI to connect to
  * @param {number} - The port number of the connection
  * @param {string} - The encoding setting
  * @returns {Promise}
  */
  contact(uri, port, encoding) {
    return new Promise((resolve, reject) => {
      this.once('error', () => reject('vndbjs: connection failed'));
      this.on('connect', () => {
        this.setEncoding(encoding);
        this.removeAllListeners('error');
        this.removeAllListeners('connect');
        resolve();
      });
      this.connect(port, uri);
    });
  }

  /**
  * Registers client name with vndb.org
  * Resolves once the server authorizes connection
  * @param {string} - A UUID for this particular connection, used to log in
  * @returns {Promise}
  */
  register(clientName) {
    return new Promise((resolve, reject) => {
      this.once('error', error => reject(error));
      let chunk = '';
      this.on('data', (data) => {
        chunk += data.toString();
        const response = chunk.substring(0, chunk.indexOf(this.eol));
        if (response === 'ok') {
          this.removeAllListeners('error');
          this.removeAllListeners('data');
          resolve();
        }
      });
      this.send(`login {"protocol":1,"client":"${clientName}","clientver":"${version}"}`);
    });
  }

  /**
  * A utility function, appends the ending code
  * @param {string} - The content of the message
  */
  send(contents) {
    this.write(`${contents}${this.eol}`);
  }
}

module.exports = Courier;
